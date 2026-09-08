import { FormEvent, useEffect, useState } from "react";

type Book = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: "published" | "draft" | "archived";
  publishedYear: number | null;
  coverKey: string | null;
};
const emptyBook = {
  title: "",
  slug: "",
  summary: "",
  publishedYear: "",
  status: "draft",
};

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState(emptyBook);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    void fetch("/api/v1/admin/books", { credentials: "include" })
      .then(async (response) =>
        response.ok ? ((await response.json()) as Book[]) : []
      )
      .then(setBooks);
  }, []);
  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/v1/admin/books", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
      }),
    });
    const payload = (await response.json()) as
      Book | { error?: { message?: string } };
    setBusy(false);
    if (!response.ok) {
      setMessage(
        (payload as { error?: { message?: string } }).error?.message ??
          "Unable to create the book."
      );
      return;
    }
    setBooks((items) => [payload as Book, ...items]);
    setForm(emptyBook);
    setMessage("Book created.");
  }
  async function changeStatus(id: string, status: Book["status"]) {
    const response = await fetch(`/api/v1/admin/books/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok)
      setBooks((items) =>
        items.map((book) => (book.id === id ? { ...book, status } : book))
      );
  }
  async function uploadCover(bookId: string, file: File) {
    setMessage("");
    const response = await fetch(`/api/v1/admin/books/${bookId}/cover`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const payload = (await response.json()) as {
      coverKey?: string;
      error?: { message?: string };
    };
    if (!response.ok) {
      setMessage(payload.error?.message ?? "Unable to upload cover.");
      return;
    }
    setBooks((items) =>
      items.map((book) =>
        book.id === bookId
          ? { ...book, coverKey: payload.coverKey ?? null }
          : book
      )
    );
    setMessage("Cover uploaded.");
  }
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Manage books</h1>
          <p>
            Create drafts, publish completed records, and archive obsolete
            entries.
          </p>
        </div>
      </div>
      <div className="catalog-admin-grid">
        <form
          className="admin-panel catalog-form"
          onSubmit={(event) => void submit(event)}
        >
          <h2>Add a book</h2>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
            />
          </label>
          <label>
            URL slug
            <input
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              value={form.slug}
              onChange={(event) => update("slug", event.target.value)}
            />
          </label>
          <label>
            Publication year
            <input
              min="0"
              max="3000"
              type="number"
              value={form.publishedYear}
              onChange={(event) => update("publishedYear", event.target.value)}
            />
          </label>
          <label>
            Summary
            <textarea
              required
              minLength={10}
              value={form.summary}
              onChange={(event) => update("summary", event.target.value)}
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <button
            className="button button-primary"
            disabled={busy}
            type="submit"
          >
            {busy ? "Creating..." : "Create book"}
          </button>
          {message && <p role="status">{message}</p>}
        </form>
        <section className="admin-panel catalog-records">
          <div className="panel-heading">
            <h2>Catalog records</h2>
            <span>{books.length}</span>
          </div>
          {books.map((book) => (
            <article key={book.id}>
              <div>
                <span className="status-badge">{book.status}</span>
                <h3>{book.title}</h3>
                <small>
                  /{book.slug}
                  {book.publishedYear ? ` · ${book.publishedYear}` : ""}
                </small>
              </div>
              <div className="moderation-actions">
                <label className="button button-secondary cover-upload">
                  Cover
                  <input
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadCover(book.id, file);
                    }}
                    type="file"
                  />
                </label>
                <button
                  className="button button-secondary"
                  onClick={() => void changeStatus(book.id, "draft")}
                  type="button"
                >
                  Draft
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => void changeStatus(book.id, "published")}
                  type="button"
                >
                  Publish
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => void changeStatus(book.id, "archived")}
                  type="button"
                >
                  Archive
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}

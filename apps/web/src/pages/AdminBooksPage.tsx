import { FormEvent, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Edit2 } from "lucide-react";

type Book = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: "published" | "draft" | "archived";
  publishedYear: number | null;
  coverKey: string | null;
};
const emptyBook: Pick<Book, 'title' | 'slug' | 'summary' | 'status'> & { publishedYear: string, authorIds: string } = {
  title: "",
  slug: "",
  summary: "",
  publishedYear: "",
  status: "draft",
  authorIds: "",
};

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState(emptyBook);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  
  const limit = 20;

  useEffect(() => {
    fetchBooks();
  }, [page, query]);
  
  function fetchBooks() {
    const offset = (page - 1) * limit;
    void fetch(`/api/v1/admin/books?offset=${offset}&limit=${limit}&q=${encodeURIComponent(query)}`, { credentials: "include" })
      .then(async (response) =>
        response.ok ? ((await response.json()) as Book[]) : []
      )
      .then(setBooks);
  }

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function editBook(book: Book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      slug: book.slug,
      summary: book.summary,
      publishedYear: book.publishedYear ? String(book.publishedYear) : "",
      status: book.status,
      authorIds: "", // We don't fetch author IDs yet
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyBook);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    
    const url = editingId ? `/api/v1/admin/books/${editingId}` : "/api/v1/admin/books";
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        publishedYear: form.publishedYear ? Number(form.publishedYear) : null,
        authorIds: form.authorIds ? form.authorIds.split(",").map(id => id.trim()).filter(Boolean) : [],
      }),
    });
    
    const payload = (await response.json()) as
      Book | { error?: { message?: string } };
    setBusy(false);
    
    if (!response.ok) {
      setMessage(
        (payload as { error?: { message?: string } }).error?.message ??
          "Unable to save the book."
      );
      return;
    }
    
    setForm(emptyBook);
    setEditingId(null);
    setMessage(editingId ? "Book updated." : "Book created.");
    fetchBooks();
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
            Maintain catalog integrity, fix missing covers, and edit metadata.
          </p>
        </div>
      </div>
      <div className="catalog-admin-grid">
        <form
          className="admin-panel catalog-form"
          onSubmit={(event) => void submit(event)}
        >
          <div className="panel-heading" style={{ marginBottom: "16px" }}>
             <h2>{editingId ? "Edit book" : "Add a book"}</h2>
             {editingId && (
               <button type="button" onClick={cancelEdit} className="button button-secondary">Cancel</button>
             )}
          </div>
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
            Author IDs (comma-separated)
            <input
              value={form.authorIds}
              placeholder="uuid-1, uuid-2"
              onChange={(event) => update("authorIds", event.target.value)}
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
            {busy ? "Saving..." : (editingId ? "Save changes" : "Create book")}
          </button>
          {message && <p role="status">{message}</p>}
        </form>
        
        <section className="admin-panel catalog-records">
          <div className="panel-heading" style={{ marginBottom: "16px" }}>
            <h2>Catalog records</h2>
            <div className="admin-search" style={{ margin: 0 }}>
               <Search size={16} />
               <input 
                  type="text" 
                  placeholder="Search books..." 
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  style={{ border: "none", background: "transparent", outline: "none", width: "100%" }}
               />
            </div>
          </div>
          
          <div className="catalog-list">
             {books.length === 0 ? (
               <p style={{ color: "var(--muted)" }}>No books found.</p>
             ) : books.map((book) => (
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
                  <button className="button button-secondary" onClick={() => editBook(book)} type="button">
                    <Edit2 size={14} /> Edit
                  </button>
                  <label className="button button-secondary cover-upload">
                    {book.coverKey ? "Change Cover" : "Add Cover"}
                    <input
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void uploadCover(book.id, file);
                      }}
                      type="file"
                    />
                  </label>
                  {book.status !== 'draft' && (
                     <button
                       className="button button-secondary"
                       onClick={() => void changeStatus(book.id, "draft")}
                       type="button"
                     >
                       Draft
                     </button>
                  )}
                  {book.status !== 'published' && (
                     <button
                       className="button button-secondary"
                       onClick={() => void changeStatus(book.id, "published")}
                       type="button"
                     >
                       Publish
                     </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          
          <div className="pagination-controls" style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
             <button 
                className="button button-secondary" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
             >
                <ChevronLeft size={16} /> Previous
             </button>
             <button 
                className="button button-secondary" 
                disabled={books.length < limit}
                onClick={() => setPage(p => p + 1)}
             >
                Next <ChevronRight size={16} />
             </button>
          </div>
        </section>
      </div>
    </>
  );
}

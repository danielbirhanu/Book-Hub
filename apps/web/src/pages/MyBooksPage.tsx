import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Book = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  publishedYear: number | null;
  ratingAverage: number;
  ratingCount: number;
  coverUrl: string | null;
};

type Item = {
  status: "want-to-read" | "reading" | "read";
  book: Book;
};

export function MyBooksPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [message, setMessage] = useState("Loading your shelves...");

  useEffect(() => {
    void fetch("/api/v1/me/books")
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return (await response.json()) as Item[];
      })
      .then((data) => {
        setItems(data);
        setMessage(data.length ? "" : "Your reading shelves are empty.");
      })
      .catch(() => setMessage("Sign in to view your reading shelves."));
  }, []);

  const currentlyReading = items.filter((item) => item.status === "reading");
  const wantToRead = items.filter((item) => item.status === "want-to-read");
  const read = items.filter((item) => item.status === "read");

  return (
    <main className="section library-page" style={{ paddingBottom: "80px" }}>
      <div className="section-heading" style={{ marginBottom: "48px" }}>
        <div>
          <p className="eyebrow">Your library</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "40px", color: "var(--ink)", margin: "0 0 8px 0" }}>
            My books
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "18px" }}>Keep track of everything in your reading life.</p>
        </div>
      </div>
      
      {message && <p className="catalog-state">{message}</p>}

      {!message && (
        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          <BookShelf title="Currently Reading" items={currentlyReading} />
          <BookShelf title="Want to Read" items={wantToRead} />
          <BookShelf title="Finished Reading" items={read} />
        </div>
      )}
    </main>
  );
}

function BookShelf({ title, items }: { title: string; items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section>
      <h2 style={{ marginBottom: "24px", fontSize: "24px", color: "var(--ink)" }}>{title}</h2>
      <div className="book-grid">
        {items.map(({ book }) => (
          <Link className="book-card" key={book.id} to={`/books/${book.slug}`}>
            <div
              className={`book-cover ${!book.coverUrl ? ["cover-rust", "cover-ink", "cover-green", "cover-gold"][Math.abs(book.id.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % 4] : ""}`}
            >
              {book.coverUrl ? (
                <img alt={`Cover of ${book.title}`} src={book.coverUrl} />
              ) : (
                <>
                  <span>{book.publishedYear ?? "New"}</span>
                  <strong>{book.title}</strong>
                </>
              )}
            </div>
            <h3>{book.title}</h3>
            <p>{book.publishedYear ?? "Book Hub"}</p>
            <div className="rating">
              <Star aria-hidden="true" fill="currentColor" size={15} />
              <span>{book.ratingAverage.toFixed(1)}</span>
              <small>({book.ratingCount})</small>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

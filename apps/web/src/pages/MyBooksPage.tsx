import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Item = {
  status: string;
  book: { slug: string; title: string; summary: string };
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
  return (
    <main className="section library-page">
      <p className="eyebrow">Your library</p>
      <h1>My books</h1>
      {message && <p className="catalog-state">{message}</p>}
      <div className="library-list">
        {items.map((item) => (
          <article className="review-item" key={item.book.slug}>
            <span className="status-badge">{item.status}</span>
            <h2>
              <Link to={`/books/${item.book.slug}`}>{item.book.title}</Link>
            </h2>
            <p>{item.book.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
}

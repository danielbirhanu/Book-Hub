import { ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

type DiscoverFeeds = {
  highestRated: Book[];
  newArrivals: Book[];
  sciFi: Book[];
  fiction: Book[];
};

export function DiscoverPage() {
  const [feeds, setFeeds] = useState<DiscoverFeeds | null>(null);

  useEffect(() => {
    void Promise.all([
      fetch("/api/v1/books?limit=6&sort=rating").then((res) => res.json() as Promise<{ items: Book[] }>),
      fetch("/api/v1/books?limit=6&sort=newest").then((res) => res.json() as Promise<{ items: Book[] }>),
      fetch("/api/v1/books?limit=6&genre=science-fiction&sort=rating").then((res) => res.json() as Promise<{ items: Book[] }>),
      fetch("/api/v1/books?limit=6&genre=fiction&sort=rating").then((res) => res.json() as Promise<{ items: Book[] }>),
    ]).then(([highestRated, newArrivals, sciFi, fiction]) => {
      setFeeds({
        highestRated: highestRated.items,
        newArrivals: newArrivals.items,
        sciFi: sciFi.items,
        fiction: fiction.items,
      });
    });
  }, []);

  if (!feeds) return <main className="catalog-state">Loading recommendations...</main>;

  return (
    <main className="discover-page section">
      <div className="discover-heading">
        <p className="eyebrow">Discover</p>
        <h1>Curated for you.</h1>
        <p>Explore top picks, new releases, and community favorites.</p>
      </div>

      <DiscoverSection title="Highest Rated" books={feeds.highestRated} />
      <DiscoverSection title="New Arrivals" books={feeds.newArrivals} />
      <DiscoverSection title="Top Science Fiction" books={feeds.sciFi} />
      <DiscoverSection title="Fiction Favorites" books={feeds.fiction} />
    </main>
  );
}

function DiscoverSection({ title, books }: { title: string; books: Book[] }) {
  if (books.length === 0) return null;

  return (
    <section className="discover-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <Link className="inline-link" to="/browse">
          View all <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>
      <div className="discover-carousel">
        {books.map((book) => (
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

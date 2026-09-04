import { Search, Star } from "lucide-react";
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
};
type Genre = { id: string; name: string; slug: string };

export function BrowsePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void Promise.all([
      fetch(`/api/v1/books?q=${encodeURIComponent(query)}&sort=${sort}`).then(
        (response) => response.json() as Promise<{ items: Book[] }>
      ),
      fetch("/api/v1/genres").then(
        (response) => response.json() as Promise<Genre[]>
      ),
    ])
      .then(([bookResult, genreResult]) => {
        setBooks(bookResult.items);
        setGenres(genreResult);
      })
      .finally(() => setLoading(false));
  }, [query, sort]);
  return (
    <main className="browse-page section">
      <div className="browse-heading">
        <div>
          <p className="eyebrow">The catalog</p>
          <h1>Find your next book.</h1>
          <p>Browse a growing collection shaped by thoughtful readers.</p>
        </div>
        <label className="catalog-search">
          <Search aria-hidden="true" size={18} />
          <span className="sr-only">Search books</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or description"
          />
        </label>
      </div>
      <div className="browse-toolbar">
        <div className="genre-pills">
          <button className="genre-pill active" type="button">
            All books
          </button>
          {genres.map((genre) => (
            <button className="genre-pill" key={genre.id} type="button">
              {genre.name}
            </button>
          ))}
        </div>
        <label className="sort-control">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="newest">Recently added</option>
            <option value="rating">Highest rated</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>
      {loading ? (
        <div className="catalog-state">Loading the catalog...</div>
      ) : (
        <div className="catalog-grid">
          {books.map((book) => (
            <Link
              className="catalog-card"
              key={book.id}
              to={`/books/${book.slug}`}
            >
              <div className="catalog-cover">
                <span>{book.publishedYear ?? "New"}</span>
                <strong>{book.title}</strong>
              </div>
              <h2>{book.title}</h2>
              <p>{book.summary}</p>
              <div className="rating">
                <Star aria-hidden="true" fill="currentColor" size={15} />
                <span>{book.ratingAverage.toFixed(1)}</span>
                <small>{book.ratingCount.toLocaleString()} ratings</small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

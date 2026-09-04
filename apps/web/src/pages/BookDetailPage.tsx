import { ArrowLeft, BookOpen, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Book = {
  title: string;
  summary: string;
  publishedYear: number | null;
  ratingAverage: number;
  ratingCount: number;
  genres: { name: string }[];
  authors: { name: string }[];
};

export function BookDetailPage() {
  const { slug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  useEffect(() => {
    void fetch(`/api/v1/books/${slug}`)
      .then((response) =>
        response.ok ? (response.json() as Promise<Book>) : null
      )
      .then(setBook);
  }, [slug]);
  if (!book) return <main className="catalog-state">Loading book...</main>;
  return (
    <main className="book-detail section">
      <Link className="back-link" to="/browse">
        <ArrowLeft aria-hidden="true" size={17} /> Back to catalog
      </Link>
      <div className="book-detail-grid">
        <div className="detail-cover">
          <BookOpen aria-hidden="true" size={48} />
          <strong>{book.title}</strong>
        </div>
        <div>
          <p className="eyebrow">
            {book.genres.map((genre) => genre.name).join(" · ")}
          </p>
          <h1>{book.title}</h1>
          <p className="detail-author">
            {book.authors.map((author) => author.name).join(", ")} ·{" "}
            {book.publishedYear}
          </p>
          <div className="detail-rating">
            <Star aria-hidden="true" fill="currentColor" size={20} />
            <strong>{book.ratingAverage.toFixed(1)}</strong>
            <span>{book.ratingCount.toLocaleString()} community ratings</span>
          </div>
          <p className="detail-summary">{book.summary}</p>
        </div>
      </div>
    </main>
  );
}

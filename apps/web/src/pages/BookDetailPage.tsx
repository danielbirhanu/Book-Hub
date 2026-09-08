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
  id: string;
  reviews: {
    id: string;
    rating: number;
    body: string;
    spoiler: boolean;
    username: string;
    createdAt: string;
  }[];
  coverUrl: string | null;
};

export function BookDetailPage() {
  const { slug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    void fetch(`/api/v1/books/${slug}`)
      .then((response) =>
        response.ok ? (response.json() as Promise<Book>) : null
      )
      .then(setBook);
  }, [slug]);
  async function submitReview(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`/api/v1/books/${slug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, body, spoiler: false }),
    });
    setMessage(
      response.ok
        ? "Review saved."
        : "Sign in to leave a review, and use at least 10 characters."
    );
    if (response.ok) {
      setBody("");
      const refreshed = await fetch(`/api/v1/books/${slug}`);
      setBook((await refreshed.json()) as Book);
    }
  }
  async function setStatus(status: string) {
    const response = await fetch(`/api/v1/me/books/${book?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setMessage(
      response.ok
        ? `Added to ${status}.`
        : "Sign in to manage your reading list."
    );
  }
  if (!book) return <main className="catalog-state">Loading book...</main>;
  return (
    <main className="book-detail section">
      <Link className="back-link" to="/browse">
        <ArrowLeft aria-hidden="true" size={17} /> Back to catalog
      </Link>
      <div className="book-detail-grid">
        <div className="detail-cover">
          {book.coverUrl ? (
            <img alt={`Cover of ${book.title}`} src={book.coverUrl} />
          ) : (
            <>
              <BookOpen aria-hidden="true" size={48} />
              <strong>{book.title}</strong>
            </>
          )}
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
          <div className="hero-actions">
            <button
              className="button button-secondary"
              onClick={() => void setStatus("want-to-read")}
              type="button"
            >
              Want to read
            </button>
            <button
              className="button button-secondary"
              onClick={() => void setStatus("reading")}
              type="button"
            >
              Reading
            </button>
            <button
              className="button button-primary"
              onClick={() => void setStatus("read")}
              type="button"
            >
              Finished
            </button>
          </div>
        </div>
      </div>
      <section className="detail-reviews">
        <h2>Reader reviews</h2>
        {book.reviews.map((review) => (
          <article className="review-item" key={review.id}>
            <strong>{review.username}</strong>
            <span> · {review.rating}/5</span>
            <p>{review.body}</p>
          </article>
        ))}
        <form
          className="review-form"
          onSubmit={(event) => void submitReview(event)}
        >
          <h3>Share your take</h3>
          <label>
            Rating
            <select
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}/5
                </option>
              ))}
            </select>
          </label>
          <textarea
            required
            minLength={10}
            maxLength={5000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="What stayed with you?"
          />
          <button className="button button-primary" type="submit">
            Publish review
          </button>
          {message && <p role="status">{message}</p>}
        </form>
      </section>
    </main>
  );
}

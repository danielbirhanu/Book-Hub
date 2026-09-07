import { useEffect, useState } from "react";

type Review = {
  id: string;
  bookTitle: string;
  username: string;
  rating: number;
  body: string;
  status: "published" | "hidden" | "removed";
  createdAt: string;
};

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("Loading reviews...");
  useEffect(() => {
    void fetch("/api/v1/admin/reviews", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return (await response.json()) as Review[];
      })
      .then((items) => {
        setReviews(items);
        setMessage(items.length ? "" : "No reviews to moderate.");
      })
      .catch(() => setMessage("Unable to load reviews."));
  }, []);
  async function moderate(id: string, status: Review["status"]) {
    const response = await fetch(`/api/v1/admin/reviews/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok)
      setReviews((items) =>
        items.map((item) => (item.id === id ? { ...item, status } : item))
      );
    else setMessage("Unable to update this review.");
  }
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Community</p>
          <h1>Review moderation</h1>
          <p>Manage published and restricted reader contributions.</p>
        </div>
      </div>
      {message && <p role="status">{message}</p>}
      <section className="admin-panel moderation-list">
        {reviews.map((review) => (
          <article key={review.id}>
            <div className="moderation-meta">
              <span className="status-badge">{review.status}</span>
              <strong>{review.bookTitle}</strong>
              <span>
                {review.username} · {review.rating}/5
              </span>
            </div>
            <p>{review.body}</p>
            <div className="moderation-actions">
              <button
                className="button button-secondary"
                onClick={() => void moderate(review.id, "published")}
                type="button"
              >
                Publish
              </button>
              <button
                className="button button-secondary"
                onClick={() => void moderate(review.id, "hidden")}
                type="button"
              >
                Hide
              </button>
              <button
                className="button button-secondary"
                onClick={() => void moderate(review.id, "removed")}
                type="button"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

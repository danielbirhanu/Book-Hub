import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageSquareText, Flag } from "lucide-react";

type Review = {
  id: string;
  bookTitle: string;
  username: string;
  rating: number;
  body: string;
  status: "published" | "hidden" | "removed";
  createdAt: string;
};

type Report = {
  id: string;
  type: "review" | "book" | "user";
  targetId: string;
  reason: string;
  status: "open" | "resolved";
  createdAt: string;
};

export function AdminModerationPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [message, setMessage] = useState("Loading moderation data...");
  const [activeTab, setActiveTab] = useState<"reports" | "reviews">("reports");
  
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchReports();
  }, [reportsPage]);
  
  useEffect(() => {
    fetchReviews();
  }, [reviewsPage]);
  
  function fetchReports() {
    const offset = (reportsPage - 1) * limit;
    void fetch(`/api/v1/admin/reports?offset=${offset}&limit=${limit}`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return (await response.json()) as Report[];
      })
      .then((items) => {
        setReports(items);
        setMessage("");
      })
      .catch(() => setMessage("Unable to load reports."));
  }

  function fetchReviews() {
    const offset = (reviewsPage - 1) * limit;
    void fetch(`/api/v1/admin/reviews?offset=${offset}&limit=${limit}`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return (await response.json()) as Review[];
      })
      .then((items) => {
        setReviews(items);
        setMessage("");
      })
      .catch(() => setMessage("Unable to load reviews."));
  }

  async function moderateReview(id: string, status: Review["status"]) {
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
  
  async function moderateReport(id: string, status: Report["status"]) {
    const response = await fetch(`/api/v1/admin/reports/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok)
      setReports((items) =>
        items.map((item) => (item.id === id ? { ...item, status } : item))
      );
    else setMessage("Unable to update this report.");
  }

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Community</p>
          <h1>Moderation Hub</h1>
          <p>Resolve user reports and moderate reviews.</p>
        </div>
      </div>
      
      <div className="admin-tabs" style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
         <button 
           className={`button ${activeTab === 'reports' ? 'button-primary' : 'button-secondary'}`}
           onClick={() => setActiveTab('reports')}
         >
           <Flag size={16} style={{ marginRight: 8 }}/> Reports
         </button>
         <button 
           className={`button ${activeTab === 'reviews' ? 'button-primary' : 'button-secondary'}`}
           onClick={() => setActiveTab('reviews')}
         >
           <MessageSquareText size={16} style={{ marginRight: 8 }}/> Reviews
         </button>
      </div>

      {message && <p role="status">{message}</p>}
      
      {activeTab === 'reports' && (
         <section className="admin-panel moderation-list">
           {reports.length === 0 && <p style={{ color: "var(--muted)" }}>No reports found.</p>}
           {reports.map((report) => (
             <article key={report.id}>
               <div className="moderation-meta">
                 <span className="status-badge">{report.status}</span>
                 <strong>Report on {report.type} ({report.targetId})</strong>
                 <span>Reported {new Date(report.createdAt).toLocaleDateString()}</span>
               </div>
               <p>{report.reason}</p>
               <div className="moderation-actions">
                 {report.status !== 'resolved' && (
                    <button
                      className="button button-primary"
                      onClick={() => void moderateReport(report.id, "resolved")}
                      type="button"
                    >
                      Resolve
                    </button>
                 )}
                 {report.status !== 'open' && (
                    <button
                      className="button button-secondary"
                      onClick={() => void moderateReport(report.id, "open")}
                      type="button"
                    >
                      Reopen
                    </button>
                 )}
               </div>
             </article>
           ))}
           <div className="pagination-controls" style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
             <button 
                className="button button-secondary" 
                disabled={reportsPage === 1}
                onClick={() => setReportsPage(p => p - 1)}
             >
                <ChevronLeft size={16} /> Previous
             </button>
             <button 
                className="button button-secondary" 
                disabled={reports.length < limit}
                onClick={() => setReportsPage(p => p + 1)}
             >
                Next <ChevronRight size={16} />
             </button>
          </div>
         </section>
      )}

      {activeTab === 'reviews' && (
         <section className="admin-panel moderation-list">
           {reviews.length === 0 && <p style={{ color: "var(--muted)" }}>No reviews found.</p>}
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
                   onClick={() => void moderateReview(review.id, "published")}
                   type="button"
                 >
                   Publish
                 </button>
                 <button
                   className="button button-secondary"
                   onClick={() => void moderateReview(review.id, "hidden")}
                   type="button"
                 >
                   Hide
                 </button>
                 <button
                   className="button button-secondary"
                   onClick={() => void moderateReview(review.id, "removed")}
                   type="button"
                 >
                   Remove
                 </button>
               </div>
             </article>
           ))}
           <div className="pagination-controls" style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
             <button 
                className="button button-secondary" 
                disabled={reviewsPage === 1}
                onClick={() => setReviewsPage(p => p - 1)}
             >
                <ChevronLeft size={16} /> Previous
             </button>
             <button 
                className="button button-secondary" 
                disabled={reviews.length < limit}
                onClick={() => setReviewsPage(p => p + 1)}
             >
                Next <ChevronRight size={16} />
             </button>
          </div>
         </section>
      )}
    </>
  );
}

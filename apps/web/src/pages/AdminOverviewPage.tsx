import { ArrowRight, BookOpen, Flag, ImageOff, UserX } from "lucide-react";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

export function AdminOverviewPage() {
  const [stats, setStats] = useState({
    books: 0,
    missingCovers: 0,
    unlinkedAuthors: 0,
    drafts: 0,
    openReports: 0,
  });

  useEffect(() => {
    void fetch("/api/v1/admin/stats", { credentials: "include" })
      .then(async (response) =>
        response.ok ? ((await response.json()) as typeof stats) : null
      )
      .then((value) => {
        if (value) setStats(value);
      });
  }, []);

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const totalActions =
    stats.missingCovers + stats.unlinkedAuthors + stats.openReports;

  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">{today}</p>
          <h1>Action Inbox</h1>
          <p>
            {totalActions === 0
              ? "The catalog is healthy and moderation queues are clear."
              : `There are ${totalActions} items requiring your attention.`}
          </p>
        </div>
      </div>

      <div className="metric-grid admin-overview-metrics">
        <div className="metric">
          <div className="metric-label">
            <BookOpen aria-hidden="true" size={17} /> Total books
          </div>
          <strong>{stats.books}</strong>
          <small>In the catalog</small>
        </div>
        <div className="metric metric-attention">
          <div className="metric-label">
            <ImageOff aria-hidden="true" size={17} /> Missing covers
          </div>
          <strong>{stats.missingCovers}</strong>
          <small>Need artwork</small>
        </div>
        <div className="metric metric-attention">
          <div className="metric-label">
            <UserX aria-hidden="true" size={17} /> Unlinked authors
          </div>
          <strong>{stats.unlinkedAuthors}</strong>
          <small>Need a connection</small>
        </div>
        <div className="metric metric-attention">
          <div className="metric-label">
            <Flag aria-hidden="true" size={17} /> Open reports
          </div>
          <strong>{stats.openReports}</strong>
          <small>Awaiting review</small>
        </div>
      </div>

      <div
        className="admin-grid admin-overview-grid"
        style={{ gridTemplateColumns: "1fr" }}
      >
        {stats.openReports > 0 && (
          <section className="admin-panel" aria-labelledby="reports-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Community Moderation</p>
                <h2 id="reports-title">{stats.openReports} open reports</h2>
              </div>
              <Link
                to="/admin/reports"
                className="icon-button"
                aria-label="Open reports"
              >
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
            </div>
            <p style={{ color: "var(--muted)", margin: "0 0 16px" }}>
              Community members have flagged content for review.
            </p>
            <Link to="/admin/reports" className="button button-secondary">
              Review reports
            </Link>
          </section>
        )}

        {stats.missingCovers > 0 && (
          <section className="admin-panel" aria-labelledby="covers-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Catalog Integrity</p>
                <h2 id="covers-title">
                  {stats.missingCovers} books missing covers
                </h2>
              </div>
              <Link
                to="/admin/books"
                className="icon-button"
                aria-label="Open catalog"
              >
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
            </div>
            <p style={{ color: "var(--muted)", margin: "0 0 16px" }}>
              Books without covers reduce discovery and engagement.
            </p>
            <Link to="/admin/books" className="button button-secondary">
              Fix catalog
            </Link>
          </section>
        )}

        {stats.unlinkedAuthors > 0 && (
          <section className="admin-panel" aria-labelledby="authors-title">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Catalog Integrity</p>
                <h2 id="authors-title">
                  {stats.unlinkedAuthors} books without authors
                </h2>
              </div>
              <Link
                to="/admin/books"
                className="icon-button"
                aria-label="Open catalog"
              >
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
            </div>
            <p style={{ color: "var(--muted)", margin: "0 0 16px" }}>
              Missing author links break author pages and recommendations.
            </p>
            <Link to="/admin/books" className="button button-secondary">
              Link authors
            </Link>
          </section>
        )}

        {totalActions === 0 && (
          <div className="admin-empty-state">
            <p className="eyebrow">All caught up</p>
            <h2>The Librarian's Desk is clear.</h2>
            <p>There are no catalog or moderation tasks waiting for you.</p>
          </div>
        )}
      </div>
    </div>
  );
}

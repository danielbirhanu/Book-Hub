import {
  ArrowUpRight,
  BookPlus,
  Flag,
  MessageSquareText,
  Users,
} from "lucide-react";

import { AppButton } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";
import { useEffect, useState } from "react";

export function AdminOverviewPage() {
  const [stats, setStats] = useState({
    books: 0,
    reviews: 0,
    members: 0,
    drafts: 0,
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
  const metrics = [
    {
      change: "Live",
      icon: Users,
      label: "Members",
      value: stats.members.toLocaleString(),
    },
    {
      change: "Published",
      icon: MessageSquareText,
      label: "Published reviews",
      value: stats.reviews.toLocaleString(),
    },
    {
      change: "Live",
      icon: BookPlus,
      label: "Catalog books",
      value: stats.books.toLocaleString(),
    },
    {
      change: "Needs review",
      icon: Flag,
      label: "Draft books",
      value: stats.drafts.toLocaleString(),
    },
  ];
  return (
    <div>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Tuesday, September 1</p>
          <h1>Community overview</h1>
          <p>Catalog health, participation, and moderation at a glance.</p>
        </div>
        <AppButton icon={<BookPlus aria-hidden="true" size={18} />}>
          Add book
        </AppButton>
      </div>
      <section className="metric-grid" aria-label="Community metrics">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className="metric" key={metric.label}>
              <div className="metric-label">
                <Icon aria-hidden="true" size={18} />
                <span>{metric.label}</span>
              </div>
              <strong>{metric.value}</strong>
              <small>{metric.change} from last month</small>
            </article>
          );
        })}
      </section>
      <div className="admin-grid">
        <section className="admin-panel" aria-labelledby="recent-reports-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Moderation</p>
              <h2 id="recent-reports-title">Recent reports</h2>
            </div>
            <button className="icon-button" aria-label="Open reports">
              <ArrowUpRight aria-hidden="true" size={19} />
            </button>
          </div>
          <div className="report-list">
            <article>
              <div>
                <strong>Review contains harassment</strong>
                <p>Review on The Dispossessed · reported 18 min ago</p>
              </div>
              <StatusBadge tone="critical">High priority</StatusBadge>
            </article>
            <article>
              <div>
                <strong>Possible promotional content</strong>
                <p>Review on Sea of Tranquility · reported 2 hr ago</p>
              </div>
              <StatusBadge tone="warning">Needs review</StatusBadge>
            </article>
            <article>
              <div>
                <strong>Incorrect book metadata</strong>
                <p>Catalog entry · reported yesterday</p>
              </div>
              <StatusBadge>Catalog</StatusBadge>
            </article>
          </div>
        </section>
        <section className="admin-panel" aria-labelledby="catalog-health-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2 id="catalog-health-title">Data quality</h2>
            </div>
          </div>
          <div className="quality-score">
            <strong>94%</strong>
            <span>records complete</span>
          </div>
          <div className="progress-track">
            <span style={{ width: "94%" }} />
          </div>
          <ul className="quality-list">
            <li>
              <span>Missing covers</span>
              <strong>18</strong>
            </li>
            <li>
              <span>Unlinked authors</span>
              <strong>7</strong>
            </li>
            <li>
              <span>Possible duplicates</span>
              <strong>4</strong>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

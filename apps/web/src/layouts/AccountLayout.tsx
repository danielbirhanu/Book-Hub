import { ArrowLeft, BookOpen, Quote } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export function AccountLayout() {
  return (
    <main className="account-layout" id="main-content">
      <section className="account-visual" aria-label="Reader testimonial">
        <Link className="brand brand-light" to="/">
          <BookOpen aria-hidden="true" size={25} />
          <span>Book Hub</span>
        </Link>
        <div className="account-quote">
          <Quote aria-hidden="true" size={34} strokeWidth={1.4} />
          <blockquote>
            Reading is a conversation. All books talk. But a good book listens
            as well.
          </blockquote>
          <p>Mark Haddon</p>
        </div>
      </section>
      <section className="account-content">
        <Link className="back-link" to="/">
          <ArrowLeft aria-hidden="true" size={17} /> Back to Book Hub
        </Link>
        <div className="account-panel">
          <Outlet />
        </div>
      </section>
    </main>
  );
}

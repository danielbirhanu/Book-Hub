import { ArrowRight, BookMarked, Quote, Star } from "lucide-react";
import { Link } from "react-router-dom";

import libraryShelves from "../assets/library-shelves.webp";
import { AppLinkButton } from "../ui/Button";

const featuredBooks = [
  {
    author: "Ursula K. Le Guin",
    rating: "4.4",
    title: "The Left Hand of Darkness",
    tone: "rust",
  },
  {
    author: "Kazuo Ishiguro",
    rating: "4.2",
    title: "The Remains of the Day",
    tone: "ink",
  },
  { author: "Toni Morrison", rating: "4.5", title: "Beloved", tone: "green" },
  {
    author: "Umberto Eco",
    rating: "4.3",
    title: "The Name of the Rose",
    tone: "gold",
  },
];

export function HomePage() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <img
          alt="Shelves filled with books in a quiet library"
          className="hero-image"
          src={libraryShelves}
        />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <p className="eyebrow eyebrow-light">
            A better place for your reading life
          </p>
          <h1 id="hero-title">Find the books that stay with you.</h1>
          <p className="hero-description">
            Discover considered recommendations, keep a thoughtful reading
            record, and exchange reviews with people who care about books.
          </p>
          <div className="hero-actions">
            <AppLinkButton size="large" to="/discover">
              Explore books <ArrowRight aria-hidden="true" size={18} />
            </AppLinkButton>
            <AppLinkButton size="large" to="/my-books" variant="light">
              <BookMarked aria-hidden="true" size={18} /> My reading list
            </AppLinkButton>
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="noteworthy-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Community favorites</p>
            <h2 id="noteworthy-title">Books worth talking about</h2>
          </div>
          <Link className="inline-link" to="/browse">
            View all <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
        <div className="book-grid">
          {featuredBooks.map((book) => (
            <article className="book-card" key={book.title}>
              <div className={`book-cover cover-${book.tone}`}>
                <span>{book.author}</span>
                <strong>{book.title}</strong>
              </div>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <div className="rating">
                <Star aria-hidden="true" fill="currentColor" size={15} />
                <span>{book.rating}</span>
                <small>community rating</small>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="reading-band" aria-labelledby="reading-life-title">
        <div>
          <Quote aria-hidden="true" size={32} strokeWidth={1.4} />
          <h2 id="reading-life-title">
            Your reading life, in one quiet place.
          </h2>
        </div>
        <p>
          Keep track of what you want to read, what you are reading now, and the
          books you will recommend for years.
        </p>
        <AppLinkButton size="large" to="/register" variant="secondary">
          Start your library
        </AppLinkButton>
      </section>
    </main>
  );
}

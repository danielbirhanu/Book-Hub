import { ArrowRight, BookOpen, Library, Search, Star } from "lucide-react";
import { Link, Route, Routes } from "react-router-dom";

const featuredBooks = [
  {
    title: "The Left Hand of Darkness",
    author: "Ursula K. Le Guin",
    rating: "4.4",
    color: "cover-rust",
  },
  {
    title: "The Remains of the Day",
    author: "Kazuo Ishiguro",
    rating: "4.2",
    color: "cover-ink",
  },
  {
    title: "Beloved",
    author: "Toni Morrison",
    rating: "4.5",
    color: "cover-green",
  },
  {
    title: "The Name of the Rose",
    author: "Umberto Eco",
    rating: "4.3",
    color: "cover-gold",
  },
];

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Book Hub home">
        <BookOpen aria-hidden="true" size={25} strokeWidth={1.8} />
        <span>Book Hub</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link to="/discover">Discover</Link>
        <Link to="/browse">Browse</Link>
        <Link to="/my-books">My Books</Link>
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Search">
          <Search aria-hidden="true" size={20} />
        </button>
        <Link className="text-link" to="/login">
          Sign in
        </Link>
        <Link className="button button-primary" to="/register">
          Join Book Hub
        </Link>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">A better place for your reading life</p>
          <h1 id="hero-title">Find the books that stay with you.</h1>
          <p className="hero-description">
            Discover considered recommendations, keep a thoughtful reading
            record, and exchange reviews with people who care about books.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary button-large" to="/discover">
              Explore books <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link
              className="button button-secondary button-large"
              to="/my-books"
            >
              <Library aria-hidden="true" size={18} /> My reading list
            </Link>
          </div>
        </div>
        <div className="hero-shelf" aria-label="Featured reading selection">
          <div className="hero-book hero-book-back">
            <span>Essays</span>
            <strong>The Fire Next Time</strong>
            <small>James Baldwin</small>
          </div>
          <div className="hero-book hero-book-front">
            <span>Fiction</span>
            <strong>One Hundred Years of Solitude</strong>
            <small>Gabriel Garcia Marquez</small>
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
              <div className={`book-cover ${book.color}`}>
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
    </main>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="placeholder-page">
      <p className="eyebrow">Foundation in progress</p>
      <h1>{title}</h1>
      <p>This route is ready for its product implementation phase.</p>
      <Link className="inline-link" to="/">
        Return home <ArrowRight aria-hidden="true" size={17} />
      </Link>
    </main>
  );
}

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/discover"
          element={<PlaceholderPage title="Discover" />}
        />
        <Route
          path="/browse"
          element={<PlaceholderPage title="Browse books" />}
        />
        <Route
          path="/my-books"
          element={<PlaceholderPage title="My books" />}
        />
        <Route path="/login" element={<PlaceholderPage title="Sign in" />} />
        <Route
          path="/register"
          element={<PlaceholderPage title="Join Book Hub" />}
        />
        <Route path="*" element={<PlaceholderPage title="Page not found" />} />
      </Routes>
    </>
  );
}

INSERT OR IGNORE INTO genres (id, name, slug, created_at, updated_at) VALUES
  ('genre-fiction', 'Fiction', 'fiction', datetime('now'), datetime('now')),
  ('genre-essays', 'Essays', 'essays', datetime('now'), datetime('now')),
  ('genre-history', 'History', 'history', datetime('now'), datetime('now')),
  ('genre-scifi', 'Science fiction', 'science-fiction', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO authors (id, name, slug, biography, created_at, updated_at) VALUES
  ('author-le-guin', 'Ursula K. Le Guin', 'ursula-k-le-guin', 'American author known for humane, searching speculative fiction.', datetime('now'), datetime('now')),
  ('author-ishiguro', 'Kazuo Ishiguro', 'kazuo-ishiguro', 'British novelist whose work explores memory, duty, and loss.', datetime('now'), datetime('now')),
  ('author-morrison', 'Toni Morrison', 'toni-morrison', 'Nobel Prize-winning American novelist and essayist.', datetime('now'), datetime('now')),
  ('author-eco', 'Umberto Eco', 'umberto-eco', 'Italian novelist, essayist, and semiotician.', datetime('now'), datetime('now'));
INSERT OR IGNORE INTO books (id, title, slug, summary, published_year, rating_average, rating_count, status, created_at, updated_at) VALUES
  ('book-left-hand', 'The Left Hand of Darkness', 'the-left-hand-of-darkness', 'A diplomat encounters a world where people move beyond fixed ideas of gender, loyalty, and belonging.', 1969, 4.4, 1284, 'published', datetime('now', '-4 day'), datetime('now', '-4 day')),
  ('book-remains', 'The Remains of the Day', 'the-remains-of-the-day', 'A butler looks back across a life of service and asks what was surrendered in the name of duty.', 1989, 4.2, 963, 'published', datetime('now', '-3 day'), datetime('now', '-3 day')),
  ('book-beloved', 'Beloved', 'beloved', 'A haunting, intimate novel about memory, motherhood, and the costs of surviving history.', 1987, 4.5, 1762, 'published', datetime('now', '-2 day'), datetime('now', '-2 day')),
  ('book-name-rose', 'The Name of the Rose', 'the-name-of-the-rose', 'A murder mystery unfolds in a medieval abbey where knowledge is both treasure and threat.', 1980, 4.3, 1109, 'published', datetime('now', '-1 day'), datetime('now', '-1 day'));
INSERT OR IGNORE INTO book_genres (book_id, genre_id) VALUES
  ('book-left-hand', 'genre-scifi'), ('book-remains', 'genre-fiction'), ('book-beloved', 'genre-fiction'), ('book-name-rose', 'genre-history');
INSERT OR IGNORE INTO book_authors (book_id, author_id) VALUES
  ('book-left-hand', 'author-le-guin'), ('book-remains', 'author-ishiguro'), ('book-beloved', 'author-morrison'), ('book-name-rose', 'author-eco');

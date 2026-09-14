INSERT OR IGNORE INTO genres (id, name, slug, created_at, updated_at) VALUES
  ('genre-fiction', 'Fiction', 'fiction', datetime('now'), datetime('now')),
  ('genre-essays', 'Essays', 'essays', datetime('now'), datetime('now')),
  ('genre-history', 'History', 'history', datetime('now'), datetime('now')),
  ('genre-scifi', 'Science fiction', 'science-fiction', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO authors (id, name, slug, biography, created_at, updated_at) VALUES
  ('author-orwell', 'George Orwell', 'george-orwell', 'English novelist, essayist, journalist and critic.', datetime('now'), datetime('now')),
  ('author-lee', 'Harper Lee', 'harper-lee', 'American novelist best known for To Kill a Mockingbird.', datetime('now'), datetime('now')),
  ('author-fitzgerald', 'F. Scott Fitzgerald', 'f-scott-fitzgerald', 'American novelist, essayist, and short story writer.', datetime('now'), datetime('now')),
  ('author-austen', 'Jane Austen', 'jane-austen', 'English novelist known primarily for her six major novels.', datetime('now'), datetime('now')),
  ('author-melville', 'Herman Melville', 'herman-melville', 'American novelist, short story writer, and poet of the American Renaissance period.', datetime('now'), datetime('now')),
  ('author-herbert', 'Frank Herbert', 'frank-herbert', 'American science fiction author best known for the novel Dune.', datetime('now'), datetime('now')),
  ('author-tolkien', 'J.R.R. Tolkien', 'j-r-r-tolkien', 'English writer, poet, philologist, and academic.', datetime('now'), datetime('now')),
  ('author-salinger', 'J.D. Salinger', 'j-d-salinger', 'American writer known for his novel The Catcher in the Rye.', datetime('now'), datetime('now')),
  ('author-bradbury', 'Ray Bradbury', 'ray-bradbury', 'American author and screenwriter.', datetime('now'), datetime('now')),
  ('author-harari', 'Yuval Noah Harari', 'yuval-noah-harari', 'Israeli public intellectual, historian and a professor.', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO books (id, title, slug, summary, published_year, status, created_at, updated_at) VALUES
  ('book-1984', '1984', '1984', 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.', 1949, 'published', datetime('now'), datetime('now')),
  ('book-mockingbird', 'To Kill a Mockingbird', 'to-kill-a-mockingbird', 'A novel about the serious issues of rape and racial inequality told through the eyes of a child.', 1960, 'published', datetime('now'), datetime('now')),
  ('book-gatsby', 'The Great Gatsby', 'the-great-gatsby', 'A novel about the impossibility of recapturing the past and the American Dream.', 1925, 'published', datetime('now'), datetime('now')),
  ('book-pride', 'Pride and Prejudice', 'pride-and-prejudice', 'A romantic novel of manners that follows the character development of Elizabeth Bennet.', 1813, 'published', datetime('now'), datetime('now')),
  ('book-moby', 'Moby Dick', 'moby-dick', 'The narrative of sailor Ishmael''s obsessive quest to revenge himself on a white whale.', 1851, 'published', datetime('now'), datetime('now')),
  ('book-dune', 'Dune', 'dune', 'Set in the distant future amidst a feudal interstellar society, exploring the complex and multilayered interactions of politics, religion, ecology, and technology.', 1965, 'published', datetime('now'), datetime('now')),
  ('book-hobbit', 'The Hobbit', 'the-hobbit', 'A children''s fantasy novel that follows the quest of home-loving Bilbo Baggins to win a share of the treasure guarded by Smaug the dragon.', 1937, 'published', datetime('now'), datetime('now')),
  ('book-catcher', 'The Catcher in the Rye', 'the-catcher-in-the-rye', 'A novel partially published in serial form detailing two days in the life of 16-year-old Holden Caulfield.', 1951, 'published', datetime('now'), datetime('now')),
  ('book-fahrenheit', 'Fahrenheit 451', 'fahrenheit-451', 'A dystopian novel presenting a future American society where books are outlawed and firemen burn any that are found.', 1953, 'published', datetime('now'), datetime('now')),
  ('book-sapiens', 'Sapiens: A Brief History of Humankind', 'sapiens', 'A book that surveys the history of humankind from the evolution of archaic human species in the Stone Age up to the twenty-first century.', 2011, 'published', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO book_genres (book_id, genre_id) VALUES
  ('book-1984', 'genre-scifi'),
  ('book-mockingbird', 'genre-fiction'),
  ('book-gatsby', 'genre-fiction'),
  ('book-pride', 'genre-fiction'),
  ('book-moby', 'genre-fiction'),
  ('book-dune', 'genre-scifi'),
  ('book-hobbit', 'genre-fiction'),
  ('book-catcher', 'genre-fiction'),
  ('book-fahrenheit', 'genre-scifi'),
  ('book-sapiens', 'genre-history');

INSERT OR IGNORE INTO book_authors (book_id, author_id) VALUES
  ('book-1984', 'author-orwell'),
  ('book-mockingbird', 'author-lee'),
  ('book-gatsby', 'author-fitzgerald'),
  ('book-pride', 'author-austen'),
  ('book-moby', 'author-melville'),
  ('book-dune', 'author-herbert'),
  ('book-hobbit', 'author-tolkien'),
  ('book-catcher', 'author-salinger'),
  ('book-fahrenheit', 'author-bradbury'),
  ('book-sapiens', 'author-harari');

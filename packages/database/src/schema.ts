import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
};

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)]
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at").notNull(),
    lastUsedAt: text("last_used_at").notNull(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_idx").on(table.tokenHash),
    index("sessions_user_idx").on(table.userId),
  ]
);

export const genres = sqliteTable(
  "genres",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("genres_slug_idx").on(table.slug)]
);

export const authors = sqliteTable(
  "authors",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    biography: text("biography"),
    ...timestamps,
  },
  (table) => [uniqueIndex("authors_slug_idx").on(table.slug)]
);

export const books = sqliteTable(
  "books",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary").notNull(),
    coverKey: text("cover_key"),
    publishedYear: integer("published_year"),
    isbn: text("isbn"),
    ratingAverage: real("rating_average").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    status: text("status", { enum: ["published", "draft", "archived"] })
      .notNull()
      .default("published"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("books_slug_idx").on(table.slug),
    index("books_published_idx").on(table.status, table.createdAt),
    index("books_rating_idx").on(table.ratingAverage, table.ratingCount),
  ]
);

export const bookGenres = sqliteTable(
  "book_genres",
  {
    bookId: text("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    genreId: text("genre_id")
      .notNull()
      .references(() => genres.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("book_genres_unique_idx").on(table.bookId, table.genreId),
    index("book_genres_genre_idx").on(table.genreId),
  ]
);

export const bookAuthors = sqliteTable(
  "book_authors",
  {
    bookId: text("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("book_authors_unique_idx").on(table.bookId, table.authorId),
  ]
);

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    bookId: text("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    spoiler: integer("spoiler", { mode: "boolean" }).notNull().default(false),
    status: text("status", { enum: ["published", "hidden", "removed"] })
      .notNull()
      .default("published"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("reviews_book_user_idx").on(table.bookId, table.userId),
    index("reviews_book_idx").on(table.bookId, table.status, table.createdAt),
  ]
);

export const readingStatuses = sqliteTable(
  "reading_statuses",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookId: text("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    status: text("status", {
      enum: ["want-to-read", "reading", "read"],
    }).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("reading_statuses_user_book_idx").on(
      table.userId,
      table.bookId
    ),
    index("reading_statuses_user_idx").on(table.userId, table.updatedAt),
  ]
);

export type Book = typeof books.$inferSelect;
export type Genre = typeof genres.$inferSelect;

import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import { bookGenres, books, genres, sessions, users } from "./schema";

const db = (database: D1Database) => drizzle(database);

export async function findUserByEmail(database: D1Database, email: string) {
  const [user] = await db(database)
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .all();
  return user ?? null;
}

export async function findUserBySession(
  database: D1Database,
  tokenHash: string,
  now: string
) {
  const [row] = await db(database)
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        sql`${sessions.expiresAt} > ${now}`
      )
    )
    .limit(1)
    .all();
  return row ?? null;
}

export async function createUser(
  database: D1Database,
  input: {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
  }
) {
  const [user] = await db(database)
    .insert(users)
    .values({ ...input, isAdmin: false })
    .returning();
  return user;
}

export async function createSession(
  database: D1Database,
  input: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: string;
    createdAt: string;
    lastUsedAt: string;
  }
) {
  await db(database).insert(sessions).values(input);
}

export async function deleteSession(database: D1Database, tokenHash: string) {
  await db(database).delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}
export interface BookListOptions {
  genre?: string;
  limit: number;
  offset: number;
  q?: string;
  sort: "newest" | "rating" | "title";
}

export async function listGenres(database: D1Database) {
  return db(database).select().from(genres).orderBy(asc(genres.name)).all();
}

export async function listBooks(
  database: D1Database,
  options: BookListOptions
) {
  const conditions = [eq(books.status, "published")];
  if (options.q?.trim()) {
    const query = `%${options.q.trim()}%`;
    conditions.push(
      or(like(books.title, query), like(books.summary, query)) ??
        eq(books.status, "published")
    );
  }
  if (options.genre)
    conditions.push(
      sql`${books.id} in (select book_id from book_genres where genre_id = ${options.genre})`
    );
  const orderBy =
    options.sort === "rating"
      ? [desc(books.ratingAverage), desc(books.ratingCount)]
      : options.sort === "title"
        ? [asc(books.title)]
        : [desc(books.createdAt)];
  const [items, totalRows] = await Promise.all([
    db(database)
      .select()
      .from(books)
      .where(and(...conditions))
      .orderBy(...orderBy)
      .limit(options.limit)
      .offset(options.offset)
      .all(),
    db(database)
      .select({ count: sql<number>`count(*)` })
      .from(books)
      .where(and(...conditions))
      .all(),
  ]);
  return { items, total: Number(totalRows[0]?.count ?? 0) };
}

export async function getBook(database: D1Database, idOrSlug: string) {
  const [book] = await db(database)
    .select()
    .from(books)
    .where(or(eq(books.id, idOrSlug), eq(books.slug, idOrSlug)))
    .limit(1)
    .all();
  if (!book) return null;
  const bookGenreRows = await db(database)
    .select({ id: genres.id, name: genres.name, slug: genres.slug })
    .from(bookGenres)
    .innerJoin(genres, eq(bookGenres.genreId, genres.id))
    .where(eq(bookGenres.bookId, book.id))
    .all();
  return { ...book, genres: bookGenreRows };
}

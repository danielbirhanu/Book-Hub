import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  like,
  or,
  sql,
  isNull,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import {
  accountTokens,
  bookGenres,
  bookAuthors,
  books,
  genres,
  authors,
  readingStatuses,
  reports,
  reviews,
  sessions,
  users,
} from "./schema";

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

export async function createAccountToken(
  database: D1Database,
  input: {
    id: string;
    userId: string;
    tokenHash: string;
    type: "verification" | "password-reset";
    expiresAt: string;
    createdAt: string;
  }
) {
  await db(database).insert(accountTokens).values(input);
}
export async function findAccountToken(
  database: D1Database,
  tokenHash: string,
  type: "verification" | "password-reset",
  now: string
) {
  const [token] = await db(database)
    .select()
    .from(accountTokens)
    .where(
      and(
        eq(accountTokens.tokenHash, tokenHash),
        eq(accountTokens.type, type),
        sql`${accountTokens.expiresAt} > ${now}`,
        sql`${accountTokens.consumedAt} is null`
      )
    )
    .limit(1)
    .all();
  return token ?? null;
}
export async function consumeAccountToken(
  database: D1Database,
  id: string,
  userId: string,
  type: "verification" | "password-reset",
  now: string
) {
  await db(database)
    .update(accountTokens)
    .set({ consumedAt: now })
    .where(
      and(
        eq(accountTokens.id, id),
        eq(accountTokens.userId, userId),
        eq(accountTokens.type, type)
      )
    );
}
export async function markEmailVerified(
  database: D1Database,
  userId: string,
  now: string
) {
  await db(database)
    .update(users)
    .set({ emailVerifiedAt: now, updatedAt: now })
    .where(eq(users.id, userId));
}
export async function updateUserPassword(
  database: D1Database,
  userId: string,
  passwordHash: string,
  now: string
) {
  await db(database)
    .update(users)
    .set({ passwordHash, updatedAt: now })
    .where(eq(users.id, userId));
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
export async function listAdminBooks(
  database: D1Database,
  options?: { limit: number; offset: number; q?: string }
) {
  let query = db(database).select().from(books).$dynamic();
  if (options?.q?.trim()) {
    query = query.where(like(books.title, `%${options.q.trim()}%`));
  }
  if (options) {
    query = query.limit(options.limit).offset(options.offset);
  }
  return query.orderBy(desc(books.updatedAt)).all();
}
export async function getAdminStats(database: D1Database) {
  const db_ = db(database);
  const [
    booksCount,
    missingCoversCount,
    unlinkedAuthorsCount,
    draftsCount,
    openReportsCount,
  ] = await Promise.all([
    db_.select({ count: sql<number>`count(*)` }).from(books).all(),
    db_.select({ count: sql<number>`count(*)` }).from(books).where(isNull(books.coverKey)).all(),
    db_.select({ count: sql<number>`count(${books.id})` })
       .from(books)
       .leftJoin(bookAuthors, eq(books.id, bookAuthors.bookId))
       .where(isNull(bookAuthors.authorId)).all(),
    db_.select({ count: sql<number>`count(*)` }).from(books).where(eq(books.status, "draft")).all(),
    db_.select({ count: sql<number>`count(*)` }).from(reports).where(eq(reports.status, "open")).all(),
  ]);

  return {
    books: Number(booksCount[0]?.count ?? 0),
    missingCovers: Number(missingCoversCount[0]?.count ?? 0),
    unlinkedAuthors: Number(unlinkedAuthorsCount[0]?.count ?? 0),
    drafts: Number(draftsCount[0]?.count ?? 0),
    openReports: Number(openReportsCount[0]?.count ?? 0),
  };
}
type AdminBookInput = {
  title: string;
  slug: string;
  summary: string;
  publishedYear?: number | null | undefined;
  isbn?: string | null | undefined;
  status: "published" | "draft" | "archived";
  coverKey?: string | null | undefined;
  authorIds?: string[];
};

export async function createBook(
  database: D1Database,
  input: AdminBookInput & { id: string; createdAt: string; updatedAt: string }
) {
  const { authorIds, ...bookData } = input;
  const [book] = await db(database).insert(books).values(bookData).returning();
  
  if (authorIds && authorIds.length > 0) {
    const authorRecords = authorIds.map(authorId => ({ bookId: book.id, authorId }));
    await db(database).insert(bookAuthors).values(authorRecords);
  }
  
  return book;
}

export async function updateBook(
  database: D1Database,
  id: string,
  input: Partial<AdminBookInput>
) {
  const { authorIds, ...bookData } = input;
  let book = null;
  if (Object.keys(bookData).length > 0) {
    const records = await db(database)
      .update(books)
      .set({ ...bookData, updatedAt: new Date().toISOString() })
      .where(eq(books.id, id))
      .returning();
    book = records[0];
  } else {
    const records = await db(database).select().from(books).where(eq(books.id, id));
    book = records[0];
  }
  
  if (authorIds !== undefined) {
    await db(database).delete(bookAuthors).where(eq(bookAuthors.bookId, id));
    if (authorIds.length > 0) {
      const authorRecords = authorIds.map(authorId => ({ bookId: id, authorId }));
      await db(database).insert(bookAuthors).values(authorRecords);
    }
  }
  
  return book ?? null;
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
      sql`${books.id} in (select book_genres.book_id from book_genres inner join genres on book_genres.genre_id = genres.id where genres.slug = ${options.genre})`
    );
  const orderBy =
    options.sort === "rating"
      ? [
          desc(
            sql`coalesce((select avg(rating) from reviews where book_id = books.id and status = 'published'), 0)`
          ),
          desc(
            sql`(select count(*) from reviews where book_id = books.id and status = 'published')`
          ),
        ]
      : options.sort === "title"
        ? [asc(books.title)]
        : [desc(books.createdAt)];
  const [items, totalRows] = await Promise.all([
    db(database)
      .select({
        ...getTableColumns(books),
        ratingAverage:
          sql<number>`coalesce((select avg(rating) from reviews where book_id = books.id and status = 'published'), 0)`.mapWith(
            Number
          ),
        ratingCount:
          sql<number>`(select count(*) from reviews where book_id = books.id and status = 'published')`.mapWith(
            Number
          ),
      })
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
    .select({
      ...getTableColumns(books),
      ratingAverage:
        sql<number>`coalesce((select avg(rating) from reviews where book_id = books.id and status = 'published'), 0)`.mapWith(
          Number
        ),
      ratingCount:
        sql<number>`(select count(*) from reviews where book_id = books.id and status = 'published')`.mapWith(
          Number
        ),
    })
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
    
  const bookAuthorRows = await db(database)
    .select({ id: authors.id, name: authors.name, slug: authors.slug })
    .from(bookAuthors)
    .innerJoin(authors, eq(bookAuthors.authorId, authors.id))
    .where(eq(bookAuthors.bookId, book.id))
    .all();

  const reviewRows = await db(database)
    .select({
      id: reviews.id,
      rating: reviews.rating,
      body: reviews.body,
      spoiler: reviews.spoiler,
      createdAt: reviews.createdAt,
      username: users.username,
      userId: reviews.userId,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(and(eq(reviews.bookId, book.id), eq(reviews.status, "published")))
    .orderBy(desc(reviews.createdAt))
    .all();
    
  return { ...book, genres: bookGenreRows, authors: bookAuthorRows, reviews: reviewRows };
}

export async function upsertReview(
  database: D1Database,
  input: {
    id: string;
    bookId: string;
    userId: string;
    rating: number;
    body: string;
    spoiler: boolean;
    createdAt: string;
    updatedAt: string;
  }
) {
  const existing = await db(database)
    .select({ id: reviews.id })
    .from(reviews)
    .where(
      and(eq(reviews.bookId, input.bookId), eq(reviews.userId, input.userId))
    )
    .limit(1)
    .all();
  if (existing[0]) {
    const [review] = await db(database)
      .update(reviews)
      .set({
        rating: input.rating,
        body: input.body,
        spoiler: input.spoiler,
        updatedAt: input.updatedAt,
        status: "published",
      })
      .where(eq(reviews.id, existing[0].id))
      .returning();
    return review;
  }
  const [review] = await db(database).insert(reviews).values(input).returning();
  return review;
}

export async function deleteReview(
  database: D1Database,
  bookId: string,
  userId: string
) {
  await db(database)
    .delete(reviews)
    .where(and(eq(reviews.bookId, bookId), eq(reviews.userId, userId)));
}

export async function listAllReviews(
  database: D1Database,
  options?: { limit: number; offset: number }
) {
  let query = db(database)
    .select({
      id: reviews.id,
      bookId: reviews.bookId,
      bookTitle: books.title,
      userId: reviews.userId,
      username: users.username,
      rating: reviews.rating,
      body: reviews.body,
      status: reviews.status,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .innerJoin(books, eq(reviews.bookId, books.id))
    .innerJoin(users, eq(reviews.userId, users.id))
    .$dynamic();
    
  if (options) {
    query = query.limit(options.limit).offset(options.offset);
  }
  return query.orderBy(desc(reviews.createdAt)).all();
}

export async function updateReviewStatus(
  database: D1Database,
  id: string,
  status: "published" | "hidden" | "removed"
) {
  const [review] = await db(database)
    .update(reviews)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(reviews.id, id))
    .returning();
  return review ?? null;
}

export async function listReadingStatuses(
  database: D1Database,
  userId: string
) {
  return db(database)
    .select({
      status: readingStatuses.status,
      book: {
        ...getTableColumns(books),
        ratingAverage:
          sql<number>`coalesce((select avg(rating) from reviews where book_id = books.id and status = 'published'), 0)`.mapWith(
            Number
          ),
        ratingCount:
          sql<number>`(select count(*) from reviews where book_id = books.id and status = 'published')`.mapWith(
            Number
          ),
      },
    })
    .from(readingStatuses)
    .innerJoin(books, eq(readingStatuses.bookId, books.id))
    .where(eq(readingStatuses.userId, userId))
    .orderBy(desc(readingStatuses.updatedAt))
    .all();
}

export async function setReadingStatus(
  database: D1Database,
  input: {
    userId: string;
    bookId: string;
    status: "want-to-read" | "reading" | "read";
    createdAt: string;
    updatedAt: string;
  }
) {
  await db(database)
    .insert(readingStatuses)
    .values(input)
    .onConflictDoUpdate({
      target: [readingStatuses.userId, readingStatuses.bookId],
      set: { status: input.status, updatedAt: input.updatedAt },
    });
}

export async function listAdminMembers(
  database: D1Database,
  options?: { limit: number; offset: number; q?: string }
) {
  let query = db(database).select().from(users).$dynamic();
  if (options?.q?.trim()) {
    query = query.where(like(users.email, `%${options.q.trim()}%`));
  }
  if (options) {
    query = query.limit(options.limit).offset(options.offset);
  }
  return query.orderBy(desc(users.createdAt)).all();
}

export async function listAdminReports(
  database: D1Database,
  options?: { limit: number; offset: number }
) {
  let query = db(database).select().from(reports).$dynamic();
  if (options) {
    query = query.limit(options.limit).offset(options.offset);
  }
  return query.orderBy(asc(reports.status), desc(reports.createdAt)).all();
}

export async function updateReportStatus(
  database: D1Database,
  id: string,
  status: "open" | "resolved"
) {
  const [report] = await db(database)
    .update(reports)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(reports.id, id))
    .returning();
  return report ?? null;
}

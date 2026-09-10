import {
  bookListQuerySchema,
  adminBookSchema,
  healthResponseSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  readingStatusSchema,
  reviewSchema,
} from "@book-hub/contracts";
import {
  createUser,
  createAccountToken,
  consumeAccountToken,
  deleteReview,
  findUserByEmail,
  findAccountToken,
  getBook,
  listBooks,
  listAllReviews,
  listAdminBooks,
  getAdminStats,
  listGenres,
  listReadingStatuses,
  markEmailVerified,
  recalculateBookRating,
  setReadingStatus,
  updateReviewStatus,
  createBook,
  updateBook,
  updateUserPassword,
  upsertReview,
} from "@book-hub/database";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { loginSchema, registrationSchema } from "@book-hub/contracts";
import {
  currentUser,
  digest,
  hashPassword,
  issueSession,
  publicUser,
  revokeSession,
  randomToken,
  verifyPassword,
} from "./auth";
import { sendEmail } from "./email";
import { rateLimited, RateLimiter } from "./rate-limiter";

const app = new Hono<{ Bindings: Env }>();

app.use("*", secureHeaders());
app.use("/api/*", async (context, next) => {
  const id = crypto.randomUUID();
  context.header("X-Request-ID", id);
  if (["POST", "PUT", "PATCH", "DELETE"].includes(context.req.method)) {
    const origin = context.req.header("Origin");
    const requestUrl = new URL(context.req.url);
    if (origin && origin !== requestUrl.origin)
      return context.json(
        {
          error: {
            code: "CROSS_ORIGIN",
            message: "Cross-origin state changes are not allowed.",
          },
        },
        403
      );
    if (context.req.header("Sec-Fetch-Site") === "cross-site")
      return context.json(
        {
          error: {
            code: "CROSS_ORIGIN",
            message: "Cross-origin state changes are not allowed.",
          },
        },
        403
      );
  }
  await next();
});

app.get("/api/v1/health", (context) => {
  const response = healthResponseSchema.parse({
    status: "ok",
    service: "book-hub",
    environment: context.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });

  return context.json(response);
});

const sessionCookie = (token: string, expires: Date, secure: boolean) =>
  `book_hub_session=${token}; Path=/; HttpOnly; SameSite=Lax;${secure ? " Secure;" : ""} Expires=${expires.toUTCString()}`;
const clearSessionCookie =
  "book_hub_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
const isSecureRequest = (request: Request) =>
  new URL(request.url).protocol === "https:";
const coverUrl = (key: string | null) => (key ? `/api/v1/covers/${key}` : null);

async function requireAdmin(context: { env: Env; req: { raw: Request } }) {
  const user = await currentUser(context.env.DB, context.req.raw);
  return user?.isAdmin ? user : null;
}

app.post("/api/v1/auth/register", async (context) => {
  if (await rateLimited(context.env, context.req.raw, "register", 10))
    return context.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Try again shortly.",
        },
      },
      429
    );
  const parsed = registrationSchema.safeParse(await context.req.json());
  if (!parsed.success)
    return context.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Please provide a valid username, email, and password.",
        },
      },
      400
    );
  if (await findUserByEmail(context.env.DB, parsed.data.email))
    return context.json(
      {
        error: {
          code: "EMAIL_TAKEN",
          message: "An account with that email already exists.",
        },
      },
      409
    );
  const now = new Date().toISOString();
  const user = await createUser(context.env.DB, {
    id: crypto.randomUUID(),
    username: parsed.data.username,
    email: parsed.data.email,
    passwordHash: await hashPassword(parsed.data.password),
    createdAt: now,
    updatedAt: now,
  });
  if (!user)
    return context.json(
      {
        error: { code: "CREATE_FAILED", message: "Unable to create account." },
      },
      500
    );
  const session = await issueSession(context.env.DB, user.id);
  void sendEmail(context.env, {
    to: user.email,
    subject: "Welcome to Book Hub",
    html: `<p>Welcome to Book Hub, ${user.username}.</p>`,
  }).catch((error) => console.error("Welcome email failed", error));
  context.header(
    "Set-Cookie",
    sessionCookie(
      session.token,
      session.expires,
      isSecureRequest(context.req.raw)
    )
  );
  return context.json(publicUser(user), 201);
});

app.post("/api/v1/auth/login", async (context) => {
  if (await rateLimited(context.env, context.req.raw, "login", 15))
    return context.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Try again shortly.",
        },
      },
      429
    );
  const parsed = loginSchema.safeParse(await context.req.json());
  if (!parsed.success)
    return context.json(
      {
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      },
      401
    );
  const user = await findUserByEmail(context.env.DB, parsed.data.email);
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash)))
    return context.json(
      {
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      },
      401
    );
  const session = await issueSession(context.env.DB, user.id);
  context.header(
    "Set-Cookie",
    sessionCookie(
      session.token,
      session.expires,
      isSecureRequest(context.req.raw)
    )
  );
  return context.json(publicUser(user));
});

app.post("/api/v1/auth/logout", async (context) => {
  await revokeSession(context.env.DB, context.req.raw);
  context.header("Set-Cookie", clearSessionCookie);
  return context.json({ message: "Signed out" });
});
app.get("/api/v1/auth/me", async (context) => {
  const user = await currentUser(context.env.DB, context.req.raw);
  if (!user)
    return context.json(
      {
        error: { code: "UNAUTHENTICATED", message: "Authentication required." },
      },
      401
    );
  return context.json(publicUser(user));
});

app.get("/api/v1/admin/reviews", async (context) => {
  if (!(await requireAdmin(context)))
    return context.json(
      {
        error: { code: "FORBIDDEN", message: "Administrator access required." },
      },
      403
    );
  return context.json(await listAllReviews(context.env.DB));
});
app.get("/api/v1/admin/books", async (context) => {
  if (!(await requireAdmin(context)))
    return context.json(
      {
        error: { code: "FORBIDDEN", message: "Administrator access required." },
      },
      403
    );
  return context.json(await listAdminBooks(context.env.DB));
});
app.get("/api/v1/admin/stats", async (context) => {
  if (!(await requireAdmin(context)))
    return context.json(
      {
        error: { code: "FORBIDDEN", message: "Administrator access required." },
      },
      403
    );
  return context.json(await getAdminStats(context.env.DB));
});
app.post("/api/v1/admin/books", async (context) => {
  if (!(await requireAdmin(context)))
    return context.json(
      {
        error: { code: "FORBIDDEN", message: "Administrator access required." },
      },
      403
    );
  const parsed = adminBookSchema.safeParse(await context.req.json());
  if (!parsed.success)
    return context.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid book details." } },
      400
    );
  const now = new Date().toISOString();
  try {
    return context.json(
      await createBook(context.env.DB, {
        id: crypto.randomUUID(),
        ...parsed.data,
        createdAt: now,
        updatedAt: now,
      }),
      201
    );
  } catch {
    return context.json(
      {
        error: {
          code: "CONFLICT",
          message: "A book with that slug already exists.",
        },
      },
      409
    );
  }
});
app.patch("/api/v1/admin/books/:id", async (context) => {
  if (!(await requireAdmin(context)))
    return context.json(
      {
        error: { code: "FORBIDDEN", message: "Administrator access required." },
      },
      403
    );
  const parsed = adminBookSchema.partial().safeParse(await context.req.json());
  if (!parsed.success)
    return context.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid book details." } },
      400
    );
  const book = await updateBook(
    context.env.DB,
    context.req.param("id"),
    parsed.data
  );
  if (!book)
    return context.json(
      { error: { code: "NOT_FOUND", message: "Book not found." } },
      404
    );
  return context.json(book);
});

app.put("/api/v1/admin/books/:id/cover", async (context) => {
  if (!(await requireAdmin(context)))
    return context.json(
      {
        error: { code: "FORBIDDEN", message: "Administrator access required." },
      },
      403
    );
  const book = await getBook(context.env.DB, context.req.param("id"));
  if (!book)
    return context.json(
      { error: { code: "NOT_FOUND", message: "Book not found." } },
      404
    );
  const contentType = context.req.header("content-type") ?? "";
  if (!/^image\/(jpeg|png|webp)$/.test(contentType))
    return context.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Only JPEG, PNG, and WebP covers are supported.",
        },
      },
      400
    );
  const bytes = await context.req.arrayBuffer();
  if (bytes.byteLength > 5 * 1024 * 1024)
    return context.json(
      {
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: "Cover images must be 5 MB or smaller.",
        },
      },
      413
    );
  const key = `covers/${book.id}/${crypto.randomUUID()}.${contentType.split("/")[1]}`;
  await context.env.COVERS.put(key, bytes, {
    httpMetadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  await updateBook(context.env.DB, book.id, { coverKey: key });
  if (book.coverKey) await context.env.COVERS.delete(book.coverKey);
  return context.json({ coverKey: key, url: `/api/v1/covers/${key}` });
});

app.get("/api/v1/covers/:key{.+}", async (context) => {
  const object = await context.env.COVERS.get(context.req.param("key"));
  if (!object)
    return context.json(
      { error: { code: "NOT_FOUND", message: "Cover not found." } },
      404
    );
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
});

app.patch("/api/v1/admin/reviews/:id", async (context) => {
  if (!(await requireAdmin(context)))
    return context.json(
      {
        error: { code: "FORBIDDEN", message: "Administrator access required." },
      },
      403
    );
  const payload = (await context.req.json()) as { status?: string };
  if (
    payload.status !== "published" &&
    payload.status !== "hidden" &&
    payload.status !== "removed"
  )
    return context.json(
      {
        error: { code: "VALIDATION_ERROR", message: "Invalid review status." },
      },
      400
    );
  const review = await updateReviewStatus(
    context.env.DB,
    context.req.param("id"),
    payload.status
  );
  if (!review)
    return context.json(
      { error: { code: "NOT_FOUND", message: "Review not found." } },
      404
    );
  await recalculateBookRating(context.env.DB, review.bookId);
  return context.json(review);
});

app.post("/api/v1/auth/verify-email", async (context) => {
  const token = new URL(context.req.url).searchParams.get("token") ?? "";
  const record = await findAccountToken(
    context.env.DB,
    await digest(token),
    "verification",
    new Date().toISOString()
  );
  if (!record)
    return context.json(
      {
        error: {
          code: "INVALID_TOKEN",
          message: "This verification link is invalid or expired.",
        },
      },
      400
    );
  const now = new Date().toISOString();
  await markEmailVerified(context.env.DB, record.userId, now);
  await consumeAccountToken(
    context.env.DB,
    record.id,
    record.userId,
    "verification",
    now
  );
  return context.json({ message: "Email verified" });
});

app.post("/api/v1/auth/forgot-password", async (context) => {
  const parsed = passwordResetRequestSchema.safeParse(await context.req.json());
  if (!parsed.success)
    return context.json({
      message: "If an account exists, a reset link will be sent.",
    });
  const user = await findUserByEmail(context.env.DB, parsed.data.email);
  if (user) {
    const token = randomToken();
    const now = new Date();
    await createAccountToken(context.env.DB, {
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: await digest(token),
      type: "password-reset",
      expiresAt: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      createdAt: now.toISOString(),
    });
    const link = `${context.env.APP_URL ?? new URL(context.req.url).origin}/reset-password?token=${encodeURIComponent(token)}`;
    void sendEmail(context.env, {
      to: user.email,
      subject: "Reset your Book Hub password",
      html: `<p>Reset your password within one hour: <a href="${link}">${link}</a></p>`,
    }).catch((error) => console.error("Reset email failed", error));
  }
  return context.json({
    message: "If an account exists, a reset link will be sent.",
  });
});

app.post("/api/v1/auth/reset-password", async (context) => {
  const parsed = passwordResetSchema.safeParse(await context.req.json());
  if (!parsed.success)
    return context.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Provide a valid token and password.",
        },
      },
      400
    );
  const record = await findAccountToken(
    context.env.DB,
    await digest(parsed.data.token),
    "password-reset",
    new Date().toISOString()
  );
  if (!record)
    return context.json(
      {
        error: {
          code: "INVALID_TOKEN",
          message: "This reset link is invalid or expired.",
        },
      },
      400
    );
  const now = new Date().toISOString();
  await updateUserPassword(
    context.env.DB,
    record.userId,
    await hashPassword(parsed.data.password),
    now
  );
  await consumeAccountToken(
    context.env.DB,
    record.id,
    record.userId,
    "password-reset",
    now
  );
  return context.json({ message: "Password updated" });
});

app.get("/api/v1/genres", async (context) =>
  context.json(await listGenres(context.env.DB))
);

app.get("/api/v1/books", async (context) => {
  const parsed = bookListQuerySchema.safeParse(
    Object.fromEntries(new URL(context.req.url).searchParams)
  );
  if (!parsed.success)
    return context.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid catalog query",
          details: parsed.error.flatten().fieldErrors,
        },
      },
      400
    );
  const { genre, limit, page, q, sort } = parsed.data;
  const options = { limit, offset: (page - 1) * limit, sort } as const;
  const result = await listBooks(context.env.DB, {
    ...options,
    ...(genre ? { genre } : {}),
    ...(q ? { q } : {}),
  });
  return context.json({
    ...result,
    items: result.items.map((book) => ({
      ...book,
      coverUrl: coverUrl(book.coverKey),
    })),
    page,
    limit,
    totalPages: Math.ceil(result.total / limit),
  });
});

app.get("/api/v1/books/:idOrSlug", async (context) => {
  const book = await getBook(context.env.DB, context.req.param("idOrSlug"));
  if (!book)
    return context.json(
      { error: { code: "NOT_FOUND", message: "Book not found" } },
      404
    );
  return context.json({ ...book, coverUrl: coverUrl(book.coverKey) });
});

app.post("/api/v1/books/:idOrSlug/reviews", async (context) => {
  if (await rateLimited(context.env, context.req.raw, "review", 30))
    return context.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Too many requests. Try again shortly.",
        },
      },
      429
    );
  const user = await currentUser(context.env.DB, context.req.raw);
  if (!user)
    return context.json(
      {
        error: { code: "UNAUTHENTICATED", message: "Authentication required." },
      },
      401
    );
  const book = await getBook(context.env.DB, context.req.param("idOrSlug"));
  if (!book)
    return context.json(
      { error: { code: "NOT_FOUND", message: "Book not found" } },
      404
    );
  const parsed = reviewSchema.safeParse(await context.req.json());
  if (!parsed.success)
    return context.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Rating and review text are required.",
        },
      },
      400
    );
  const now = new Date().toISOString();
  const review = await upsertReview(context.env.DB, {
    id: crypto.randomUUID(),
    bookId: book.id,
    userId: user.id,
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
  });
  await recalculateBookRating(context.env.DB, book.id);
  return context.json(review, 201);
});

app.delete("/api/v1/books/:idOrSlug/reviews", async (context) => {
  const user = await currentUser(context.env.DB, context.req.raw);
  if (!user)
    return context.json(
      {
        error: { code: "UNAUTHENTICATED", message: "Authentication required." },
      },
      401
    );
  const book = await getBook(context.env.DB, context.req.param("idOrSlug"));
  if (!book)
    return context.json(
      { error: { code: "NOT_FOUND", message: "Book not found" } },
      404
    );
  await deleteReview(context.env.DB, book.id, user.id);
  await recalculateBookRating(context.env.DB, book.id);
  return context.json({ message: "Review deleted" });
});

app.get("/api/v1/me/books", async (context) => {
  const user = await currentUser(context.env.DB, context.req.raw);
  if (!user)
    return context.json(
      {
        error: { code: "UNAUTHENTICATED", message: "Authentication required." },
      },
      401
    );
  return context.json(await listReadingStatuses(context.env.DB, user.id));
});

app.put("/api/v1/me/books/:bookId", async (context) => {
  const user = await currentUser(context.env.DB, context.req.raw);
  if (!user)
    return context.json(
      {
        error: { code: "UNAUTHENTICATED", message: "Authentication required." },
      },
      401
    );
  const parsed = readingStatusSchema.safeParse(await context.req.json());
  if (!parsed.success)
    return context.json(
      {
        error: { code: "VALIDATION_ERROR", message: "Invalid reading status." },
      },
      400
    );
  const book = await getBook(context.env.DB, context.req.param("bookId"));
  if (!book)
    return context.json(
      { error: { code: "NOT_FOUND", message: "Book not found" } },
      404
    );
  const now = new Date().toISOString();
  await setReadingStatus(context.env.DB, {
    userId: user.id,
    bookId: book.id,
    ...parsed.data,
    createdAt: now,
    updatedAt: now,
  });
  return context.json({ status: parsed.data.status });
});

app.notFound((context) => {
  if (context.req.path.startsWith("/api/")) {
    return context.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "The requested API resource does not exist.",
        },
      },
      404
    );
  }

  return context.env.ASSETS.fetch(context.req.raw);
});

app.onError((error, context) => {
  console.error("Unhandled request error", {
    message: error.message,
    path: context.req.path,
  });

  return context.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
      },
    },
    500
  );
});

export default app;
export { RateLimiter };

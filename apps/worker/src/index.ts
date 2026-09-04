import { bookListQuerySchema, healthResponseSchema } from "@book-hub/contracts";
import { getBook, listBooks, listGenres } from "@book-hub/database";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono<{ Bindings: Env }>();

app.use("*", secureHeaders());

app.get("/api/v1/health", (context) => {
  const response = healthResponseSchema.parse({
    status: "ok",
    service: "book-hub",
    environment: context.env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });

  return context.json(response);
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
  return context.json(book);
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

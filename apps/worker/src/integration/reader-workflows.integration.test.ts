import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

async function register() {
  const response = await SELF.fetch("http://example.com/api/v1/auth/register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "CF-Connecting-IP": "198.51.100.31",
    },
    body: JSON.stringify({
      username: "Shelf Reader",
      email: `reader-${crypto.randomUUID()}@example.com`,
      password: "correct-horse-123",
    }),
  });
  return response.headers.get("set-cookie") ?? "";
}

describe("reader workflows with D1", () => {
  it("creates a review and updates the book aggregate", async () => {
    const cookie = await register();
    const response = await SELF.fetch(
      "http://example.com/api/v1/books/book-left-hand/reviews",
      {
        method: "POST",
        headers: { cookie, "content-type": "application/json" },
        body: JSON.stringify({
          rating: 5,
          body: "A beautiful and searching novel.",
        }),
      }
    );
    expect(response.status).toBe(201);
    const book = await SELF.fetch(
      "http://example.com/api/v1/books/book-left-hand"
    );
    await expect(book.json()).resolves.toMatchObject({
      ratingCount: 1,
      ratingAverage: 5,
    });
  });

  it("persists and replaces a reader shelf status", async () => {
    const cookie = await register();
    const update = await SELF.fetch(
      "http://example.com/api/v1/me/books/book-beloved",
      {
        method: "PUT",
        headers: { cookie, "content-type": "application/json" },
        body: JSON.stringify({ status: "reading" }),
      }
    );
    expect(update.status).toBe(200);
    await SELF.fetch("http://example.com/api/v1/me/books/book-beloved", {
      method: "PUT",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ status: "read" }),
    });
    const library = await SELF.fetch("http://example.com/api/v1/me/books", {
      headers: { cookie },
    });
    await expect(library.json()).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          status: "read",
          book: expect.objectContaining({ id: "book-beloved" }),
        }),
      ])
    );
  });
});

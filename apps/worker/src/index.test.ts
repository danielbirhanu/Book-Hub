import { describe, expect, it } from "vitest";

import app from "./index";

const bindings = { ENVIRONMENT: "local" } as Env;

describe("health endpoint", () => {
  it("returns the typed service status", async () => {
    const response = await app.request("/api/v1/health", undefined, bindings);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "ok",
      service: "book-hub",
      environment: "local",
    });
  });

  it("adds a request ID to API responses", async () => {
    const response = await app.request("/api/v1/health", undefined, bindings);
    expect(response.headers.get("x-request-id")).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe("API safeguards", () => {
  it("returns a structured API not-found response", async () => {
    const response = await app.request("/api/v1/unknown", undefined, bindings);
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "NOT_FOUND",
        message: "The requested API resource does not exist.",
      },
    });
  });

  it("rejects anonymous administration requests", async () => {
    const response = await app.request(
      "/api/v1/admin/reviews",
      undefined,
      bindings
    );
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "FORBIDDEN" },
    });
  });

  it("checks authorization before processing cover data", async () => {
    const response = await app.request(
      "/api/v1/admin/books/book-1/cover",
      {
        method: "PUT",
        headers: { "content-type": "text/plain" },
        body: "not an image",
      },
      bindings
    );
    expect(response.status).toBe(403);
  });

  it("rate limits repeated registration attempts by IP", async () => {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 11; attempt += 1) {
      response = await app.request(
        "/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "CF-Connecting-IP": "198.51.100.77",
            "content-type": "application/json",
          },
          body: "{}",
        },
        bindings
      );
    }
    expect(response?.status).toBe(429);
    await expect(response?.json()).resolves.toMatchObject({
      error: { code: "RATE_LIMITED" },
    });
  });
});

import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("admin and recovery boundaries", () => {
  it("does not disclose whether a reset email belongs to an account", async () => {
    const response = await SELF.fetch(
      "http://example.com/api/v1/auth/forgot-password",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "unknown@example.com" }),
      }
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: "If an account exists, a reset link will be sent.",
    });
  });

  it("rejects anonymous catalog administration", async () => {
    const response = await SELF.fetch("http://example.com/api/v1/admin/books", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: "Forbidden",
        slug: "forbidden",
        summary: "This should never be created anonymously.",
        status: "draft",
      }),
    });
    expect(response.status).toBe(403);
  });

  it("rejects invalid password reset tokens", async () => {
    const response = await SELF.fetch(
      "http://example.com/api/v1/auth/reset-password",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token: "invalid-token-that-is-long-enough",
          password: "new-password-123",
        }),
      }
    );
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "INVALID_TOKEN" },
    });
  });
});

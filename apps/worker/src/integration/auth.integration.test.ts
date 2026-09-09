import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("authentication with D1", () => {
  it("registers a user and resolves the issued session", async () => {
    const registration = await SELF.fetch(
      "http://example.com/api/v1/auth/register",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "CF-Connecting-IP": "203.0.113.44",
        },
        body: JSON.stringify({
          username: "Test Reader",
          email: "reader@example.com",
          password: "correct-horse-123",
        }),
      }
    );
    expect(registration.status).toBe(201);
    const cookie = registration.headers.get("set-cookie");
    expect(cookie).toContain("book_hub_session=");

    const me = await SELF.fetch("http://example.com/api/v1/auth/me", {
      headers: { cookie: cookie ?? "" },
    });
    expect(me.status).toBe(200);
    await expect(me.json()).resolves.toMatchObject({
      username: "Test Reader",
      email: "reader@example.com",
      isAdmin: false,
    });
  });
});

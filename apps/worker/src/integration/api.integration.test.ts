import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("API integration safeguards", () => {
  it("rejects invalid registration payloads at the Worker boundary", async () => {
    const response = await SELF.fetch(
      "http://example.com/api/v1/auth/register",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "not-an-email" }),
      }
    );
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "VALIDATION_ERROR" },
    });
  });

  it("protects admin review data inside the Worker runtime", async () => {
    const response = await SELF.fetch(
      "http://example.com/api/v1/admin/reviews"
    );
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: "FORBIDDEN" },
    });
  });
});

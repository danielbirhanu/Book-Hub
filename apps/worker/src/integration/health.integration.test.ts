import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Worker integration", () => {
  it("serves health inside the Workers runtime", async () => {
    const response = await SELF.fetch("http://example.com/api/v1/health");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "ok",
      service: "book-hub",
    });
  });
});

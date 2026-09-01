import { describe, expect, it } from "vitest";

import app from "./index";

describe("health endpoint", () => {
  it("returns the typed service status", async () => {
    const response = await app.request("/api/v1/health", undefined, {
      ENVIRONMENT: "local",
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "ok",
      service: "book-hub",
      environment: "local",
    });
  });
});

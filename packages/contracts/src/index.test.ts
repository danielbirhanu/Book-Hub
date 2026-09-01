import { describe, expect, it } from "vitest";

import { healthResponseSchema } from "./index";

describe("healthResponseSchema", () => {
  it("accepts a valid health response", () => {
    const result = healthResponseSchema.safeParse({
      status: "ok",
      service: "book-hub",
      environment: "local",
      timestamp: "2026-09-01T10:00:00.000Z",
    });

    expect(result.success).toBe(true);
  });
});

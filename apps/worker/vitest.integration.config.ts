import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [cloudflareTest({ wrangler: { configPath: "./wrangler.jsonc" } })],
  test: {
    name: "worker-integration",
    include: ["src/integration/**/*.test.ts"],
    setupFiles: ["src/integration/setup.ts"],
  },
});

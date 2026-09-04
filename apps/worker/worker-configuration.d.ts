interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ENVIRONMENT: "local" | "preview" | "staging" | "production";
}

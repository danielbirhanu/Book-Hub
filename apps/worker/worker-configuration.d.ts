interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  COVERS: R2Bucket;
  RATE_LIMITER: DurableObjectNamespace;
  ENVIRONMENT: "local" | "preview" | "staging" | "production";
  BREVO_API_KEY?: string;
  EMAIL_FROM?: string;
  APP_URL?: string;
}

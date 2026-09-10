interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGEKIT_PUBLIC_KEY?: string;
  IMAGEKIT_PRIVATE_KEY?: string;
  IMAGEKIT_URL_ENDPOINT?: string;
  RATE_LIMITER: DurableObjectNamespace;
  ENVIRONMENT: "local" | "preview" | "staging" | "production";
  BREVO_API_KEY?: string;
  EMAIL_FROM?: string;
  APP_URL?: string;
}

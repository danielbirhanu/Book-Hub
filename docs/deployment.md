# Deployment

## 1. Create Cloudflare resources

Authenticate Wrangler:

```bash
npx wrangler login
```

Create the production D1 database:

```bash
npx wrangler d1 create book-hub
```

ImageKit handles cover uploads and delivery; Cloudflare R2 is not required.

Copy the returned D1 `database_id` and names into the `production` section of
`apps/worker/wrangler.jsonc`.

## 2. Apply schema and seed data

Apply migrations remotely:

```bash
npm run db:migrate:production --workspace @book-hub/worker
```

Seed only a new database, if desired:

```bash
npx wrangler d1 execute book-hub-production --remote --file packages/database/seed.sql
```

## 3. Configure ImageKit secrets

```bash
npx wrangler secret put IMAGEKIT_PRIVATE_KEY --env production
npx wrangler secret put IMAGEKIT_URL_ENDPOINT --env production
```

The URL endpoint looks like `https://ik.imagekit.io/your-imagekit-id`.

## 4. Configure Brevo secrets

Store the API key as a Worker secret. Do not put it in Wrangler JSON or Git:

```bash
npx wrangler secret put BREVO_API_KEY --env production
npx wrangler secret put EMAIL_FROM --env production
npx wrangler secret put APP_URL --env production
```

`EMAIL_FROM` must be a verified Brevo sender. `APP_URL` must be the public
Worker URL (a custom domain is optional).

## 5. Deploy

```bash
npm run deploy:production --workspace @book-hub/worker
```

The Worker serves both the API and the built frontend. Validate the deployment:

```bash
curl https://YOUR_WORKER.workers.dev/api/v1/health
```

Before production launch, replace the in-memory rate limiter with a Durable
Object or coordinated KV strategy so limits apply consistently across Worker
isolates.

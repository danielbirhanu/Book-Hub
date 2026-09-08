# Book Hub

Book Hub is a book discovery, reviewing, and reading-library application on Cloudflare.

## New application

```bash
npm install
npm run dev
```

The Worker serves the API and the compiled React application at `http://localhost:8787`.

For frontend hot-module replacement during UI development, run these in separate terminals:

```bash
npm run dev
npm run dev:web
```

Then open `http://localhost:5173`. Vite proxies `/api` requests to the local Worker.

## Quality checks

```bash
npm run check
```

## Workspace

- `apps/web`: React and Vite frontend
- `apps/worker`: Cloudflare Worker and Hono API
- `packages/contracts`: shared runtime schemas and API types
- `packages/database`: D1 schema, migrations, and repositories
- `frontend` and `backend`: legacy reference implementation, retained temporarily

No production Cloudflare resources or external provider accounts are required for the current foundation phase.

import { applyD1Migrations, env } from "cloudflare:test";

import migration0 from "../../../../packages/database/migrations/0000_nappy_susan_delgado.sql?raw";
import migration1 from "../../../../packages/database/migrations/0001_harsh_princess_powerful.sql?raw";
import migration2 from "../../../../packages/database/migrations/0002_stale_jackal.sql?raw";
import migration3 from "../../../../packages/database/migrations/0003_secret_aaron_stack.sql?raw";

const split = (sql: string) =>
  sql
    .split("--> statement-breakpoint")
    .map((query) => query.trim())
    .filter(Boolean);

await applyD1Migrations(
  (env as unknown as Env).DB,
  [migration0, migration1, migration2, migration3].map((sql, index) => ({
    name: String(index).padStart(4, "0"),
    queries: split(sql),
  }))
);

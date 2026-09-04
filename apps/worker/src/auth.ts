import {
  createSession,
  deleteSession,
  findUserByEmail,
  findUserBySession,
} from "@book-hub/database";

const SESSION_DAYS = 30;
const encoder = new TextEncoder();

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}
async function digest(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(hash), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}
export async function hashPassword(password: string, salt = randomToken()) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 210_000,
      hash: "SHA-256",
    },
    key,
    256
  );
  return `${salt}.${btoa(String.fromCharCode(...new Uint8Array(bits)))}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(".");
  if (!salt || !expected) return false;
  const actual = await hashPassword(password, salt);
  return actual === stored;
}
export function publicUser(user: {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  };
}
export async function issueSession(database: D1Database, userId: string) {
  const token = randomToken();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86_400_000);
  await createSession(database, {
    id: crypto.randomUUID(),
    userId,
    tokenHash: await digest(token),
    expiresAt: expires.toISOString(),
    createdAt: now.toISOString(),
    lastUsedAt: now.toISOString(),
  });
  return { token, expires };
}
export async function currentUser(database: D1Database, request: Request) {
  const token = request.headers
    .get("Cookie")
    ?.match(/(?:^|; )book_hub_session=([^;]+)/)?.[1];
  if (!token) return null;
  return (
    (
      await findUserBySession(
        database,
        await digest(token),
        new Date().toISOString()
      )
    )?.user ?? null
  );
}
export async function revokeSession(database: D1Database, request: Request) {
  const token = request.headers
    .get("Cookie")
    ?.match(/(?:^|; )book_hub_session=([^;]+)/)?.[1];
  if (token) await deleteSession(database, await digest(token));
}
export { findUserByEmail };

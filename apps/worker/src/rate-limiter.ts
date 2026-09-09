export class RateLimiter {
  constructor(private readonly state: DurableObjectState) {}

  async fetch(request: Request) {
    const { limit, windowMs } = (await request.json()) as {
      limit: number;
      windowMs: number;
    };
    const now = Date.now();
    const stored = (await this.state.storage.get<{
      count: number;
      resetAt: number;
    }>("bucket")) ?? { count: 0, resetAt: now + windowMs };
    const bucket =
      stored.resetAt <= now ? { count: 0, resetAt: now + windowMs } : stored;
    bucket.count += 1;
    await this.state.storage.put("bucket", bucket);
    return Response.json({
      limited: bucket.count > limit,
      remaining: Math.max(0, limit - bucket.count),
      resetAt: bucket.resetAt,
    });
  }
}

const localBuckets = new Map<string, { count: number; resetAt: number }>();

export async function rateLimited(
  env: Env,
  request: Request,
  action: string,
  limit: number
) {
  const ip = request.headers.get("CF-Connecting-IP") ?? "local";
  if (!env.RATE_LIMITER) {
    const key = `${action}:${ip}`;
    const now = Date.now();
    const stored = localBuckets.get(key);
    const bucket =
      !stored || stored.resetAt <= now
        ? { count: 1, resetAt: now + 60_000 }
        : { ...stored, count: stored.count + 1 };
    localBuckets.set(key, bucket);
    return bucket.count > limit;
  }
  const id = env.RATE_LIMITER.idFromName(`${action}:${ip}`);
  const response = await env.RATE_LIMITER.get(id).fetch(
    "https://rate-limit/check",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ limit, windowMs: 60_000 }),
    }
  );
  return ((await response.json()) as { limited: boolean }).limited;
}

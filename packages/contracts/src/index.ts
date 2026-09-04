import { z } from "zod";

export const environmentSchema = z.enum([
  "local",
  "preview",
  "staging",
  "production",
]);

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("book-hub"),
  environment: environmentSchema,
  timestamp: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export const bookListQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  genre: z.string().trim().max(80).optional(),
  sort: z.enum(["newest", "rating", "title"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type BookListQuery = z.infer<typeof bookListQuerySchema>;

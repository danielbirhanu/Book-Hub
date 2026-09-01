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

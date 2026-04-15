import { z } from "zod";

export const normalizedRepositorySchema = z.object({
  owner: z.string().trim().min(1),
  repo: z.string().trim().min(1),
  fullName: z.string().trim().min(1),
  canonicalUrl: z.url(),
});

export type NormalizedRepository = z.infer<typeof normalizedRepositorySchema>;

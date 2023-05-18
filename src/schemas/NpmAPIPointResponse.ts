import { z } from 'zod';

const NpmAPIPointResponseSchema = z.object({
  package: z.string(),
  downloads: z.number(),
  start: z.string(),
  end: z.string(),
});

export { NpmAPIPointResponseSchema };

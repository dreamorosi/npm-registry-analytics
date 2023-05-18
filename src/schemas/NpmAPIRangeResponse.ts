import { z } from 'zod';

const NpmAPIRangeResponseSchema = z.object({
  package: z.string(),
  start: z.string(),
  end: z.string(),
  downloads: z.array(
    z.object({
      downloads: z.number(),
      day: z.string(),
    })
  ),
});

export { NpmAPIRangeResponseSchema };

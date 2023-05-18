import { z } from 'zod';

/**
 * Response schema for the NPM API point
 *
 * This response represents the total download count for a package in a given time period.
 *
 * @example
 * ```json
 * {
 *   "package": "@aws-lambda-powertools/logger",
 *   "start": "2021-01-01",
 *   "end": "2021-01-31",
 *   "downloads": 1000000
 * }
 * ```
 */
const NpmAPIPointResponseSchema = z.object({
  package: z.string(),
  downloads: z.number(),
  start: z.string(),
  end: z.string(),
});

export { NpmAPIPointResponseSchema };

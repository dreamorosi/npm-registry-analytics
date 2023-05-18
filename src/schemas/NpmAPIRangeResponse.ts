import { z } from 'zod';

/**
 * Response schema for the NPM API range
 *
 * This response represents the daily download counts for a package in a given time period.
 *
 * @example
 * ```json
 * {
 *   "package": "@aws-lambda-powertools/logger",
 *   "start": "2021-01-01",
 *   "end": "2021-01-31",
 *   "downloads": [
 *     {
 *       "downloads": 1000000,
 *       "day": "2021-01-01"
 *     },
 *     {
 *       "downloads": 1000000,
 *       "day": "2021-01-02"
 *     },
 *     // ...
 *     {
 *       "downloads": 1000000,
 *       "day": "2021-01-03"
 *     }
 *   ]
 * }
 * ```
 */
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

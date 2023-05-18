import { z } from 'zod';
import { RequestService } from './RequestService';
import { NpmAPIPointResponseSchema } from '../schemas/NpmAPIPointResponse';
import { NpmAPIRangeResponseSchema } from '../schemas/NpmAPIRangeResponse';
import type { ZodType } from 'zod';

type GetBetweenDatesDownloadCountOptions = {
  /**
   * The packages to get the download count for.
   * @example ['@aws-lambda-powertools/logger']
   */
  packages: string[];
  /**
   * The start Date to use in the query.
   * @example
   * '2023-01-01'
   * new Date('2023-01-01')
   */
  start: string | Date;
  /**
   * The end date to use in the query.
   * @example
   * '2023-01-01'
   * new Date('2023-01-01')
   */
  end: string | Date;
};

/**
 * Options for getting the download count for the given packages on a given day.
 */
type GetDayDownloadCountOptions = {
  /**
   * The packages to get the download count for.
   * @example ['@aws-lambda-powertools/logger']
   */
  packages: string[];
  /**
   * The date to get the download count for.
   * @example new Date('2023-01-01')
   */
  date: Date;
};

/**
 * Options for getting the download count for the given packages on a given week.
 */
type GetWeekDownloadCountOptions = {
  /**
   * The packages to get the download count for.
   * @example ['@aws-lambda-powertools/logger']
   */
  packages: string[];
  /**
   * The week to get the download count for.
   * @example
   * '2023-01-01'
   * new Date('2023-01-01')
   * '2023W01'
   * 'W01'
   */
  week: string | Date;
  /**
   * The day of the week that the week starts on.
   * @default monday
   */
  startOfWeek?: 'monday' | 'sunday';
};

/**
 * Options for getting the download count for the given packages on a given week.
 */
type GetWeekDailyDownloadCountOptions = GetWeekDownloadCountOptions;

/**
 * Options for getting the download count for the given packages in the last available day.
 */
type GetLastDayDownloadCountOptions = {
  /**
   * The packages to get the download count for.
   * @example ['@aws-lambda-powertools/logger']
   */
  packages: string[];
};

/**
 * Options for getting the download count for the given packages in the last 7 available days.
 */
type GetLastWeekDownloadCountOptions = GetLastDayDownloadCountOptions;

/**
 * Options for getting the download count for the given packages in the last 30 available days.
 */
type GetLastMonthDownloadCountOptions = GetLastDayDownloadCountOptions;

/**
 * Options for getting the daily download count for the given packages in the last 7 available days.
 */
type GetLastWeekDailyDownloadCountOptions = GetLastDayDownloadCountOptions;

/**
 * Options for getting the daily download count for the given packages in the last 30 available days.
 */
type GetLastMonthDailyDownloadCountOptions = GetLastDayDownloadCountOptions;

type NpmAPIPointResponse = z.infer<typeof NpmAPIPointResponseSchema>[];

type NpmAPIRangeResponse = z.infer<typeof NpmAPIRangeResponseSchema>[];

type NpmAPIResponse<Type extends RequestType> = Type extends 'point'
  ? NpmAPIPointResponse
  : NpmAPIRangeResponse;

interface NpmDownloadCountClient {
  /**
   * Get the download count for the given packages between the given dates.
   *
   * @example
   * ```ts
   * client.getBetweenDates({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   start: '2020-01-01',
   *   end: '2020-01-15',
   * });
   * ```
   *
   * The response will be an array of objects, one for each
   * package, with the following shape:
   *
   * @example
   * ```ts
   * {
   *   package: '@aws-lambda-powertools/logger',
   *   downloads: 1234,
   *   start: '2020-01-01',
   *   end: '2020-01-15',
   * }
   * ```
   *
   * @param options The options for getting the download count.
   * @returns The download count for the given packages between the given dates.
   */
  getBetweenDates(
    options: GetBetweenDatesDownloadCountOptions
  ): Promise<NpmAPIPointResponse>;
  /**
   * Get the daily downlods for the given packages during the last 30 available days.
   *
   * @example
   * ```ts
   * client.getDailyDownloadsForLastMonth({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   * });
   * ```
   *
   * The response will be an array of objects, one for each
   * package, with the following shape:
   *
   * @example
   * ```ts
   * {
   *   start: '2020-01-01',
   *   end: '2020-01-31',
   *   package: '@aws-lambda-powertools/logger',
   *   downloads: [
   *     {
   *       downloads: 1234,
   *       day: '2020-01-01',
   *     },
   *     // ... other days
   *     {
   *       downloads: 1234,
   *       day: '2020-01-08',
   *     },
   *   ]
   * }
   * ```
   *
   * @param options The options for getting the daily download count.
   * @returns The daily download count for the given packages during the last 30 available days.
   */
  getDailyDownloadsForLastMonth(
    options: GetLastMonthDailyDownloadCountOptions
  ): Promise<NpmAPIRangeResponse>;
  /**
   * Get the daily downlods for the given packages during the last 7 available days.
   *
   * @example
   * ```ts
   * client.getDailyDownloadsForLastWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   * });
   * ```
   *
   * The response will be an array of objects, one for each
   * package, with the following shape:
   *
   * @example
   * ```ts
   * {
   *   start: '2020-01-01',
   *   end: '2020-01-08',
   *   package: '@aws-lambda-powertools/logger',
   *   downloads: [
   *     {
   *       downloads: 1234,
   *       day: '2020-01-01',
   *     },
   *     // ... other days
   *     {
   *       downloads: 1234,
   *       day: '2020-01-08',
   *     },
   *   ]
   * }
   * ```
   *
   * @param options The options for getting the daily download count.
   * @returns The daily download count for the given packages during the last 7 available days.
   */
  getDailyDownloadsForLastWeek(
    options: GetLastWeekDailyDownloadCountOptions
  ): Promise<NpmAPIRangeResponse>;
  /**
   * Get the daily downlods for the given packages on a given month.
   *
   * @note This method is not yet implemented.
   */
  getDailyDownloadsForMonth(): Promise<void>;
  /**
   * Get the daily downlods for the given packages on a given week.
   *
   * You can use a week number (i.e. W01-W52), an ISO week (i.e. `2023W01`)
   * or a date (i.e. 2020-01-01). In the latter case, the week will be
   * calculated based on the date.
   *
   * By default, the week will start on Monday and end on Sunday, but you
   * can change this by passing the `startOfWeek` option.
   *
   * @example
   * ```ts
   * // week 1 of the current year
   * client.getDailyDownloadsForWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   week: 'W1',
   * });
   * // week 1 of 2020
   * client.getDailyDownloadsForWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   week: '2020W1',
   * });
   * // week that includes 2020-01-01
   * client.getDailyDownloadsForWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   week: '2020-01-01',
   * });
   * // week that includes 2020-01-01, starting on Sunday
   * client.getDailyDownloadsForWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   week: '2020-01-01',
   *   startOfWeek: 'sunday',
   * });
   * ```
   *
   * In all cases, the response will be an array of objects, one for each
   * package, with the following shape:
   *
   * @example
   * ```ts
   * {
   *   start: '2020-01-01',
   *   end: '2020-01-08',
   *   package: '@aws-lambda-powertools/logger',
   *   downloads: [
   *     {
   *       downloads: 1234,
   *       day: '2020-01-01',
   *     },
   *     // ... other days
   *     {
   *       downloads: 1234,
   *       day: '2020-01-08',
   *     },
   *   ]
   * }
   * ```
   *
   * @param options The options for getting the daily download count.
   * @returns The daily download count for the given packages on the given week.
   */
  getDailyDownloadsForWeek(
    options: GetWeekDailyDownloadCountOptions
  ): Promise<NpmAPIRangeResponse>;
  /**
   * Get the download count for the given packages on a given date.
   *
   * @example
   * ```ts
   * client.getDay({
   *  packages: [
   *   '@aws-lambda-powertools/logger',
   *  ],
   *  date: '2020-01-01',
   * });
   * ```
   *
   * The response will be an array of objects, one for each
   * package, with the following shape:
   *
   * @example
   * ```ts
   * {
   *   downloads: 1234;
   *   start: '2020-01-01';
   *   end: '2020-01-01';
   *   package: '@aws-lambda-powertools/logger';
   * }
   * ```
   *
   * @param options - The options for getting the download count.
   * @returns The download count for the given packages on the given date.
   */
  getDay(options: GetDayDownloadCountOptions): Promise<NpmAPIPointResponse>;
  /**
   * Get the download count for the last available day.
   *
   * In practice, this will usually be "yesterday" (in GMT) but if stats
   * for that day are not available, it will be the day before.
   *
   * @example
   * ```ts
   * client.getLastDay({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   * });
   * ```
   *
   * The response will be an array of objects, one for each
   * package, with the following shape:
   *
   * @example
   * ```ts
   * {
   *   start: '2020-01-01',
   *   end: '2020-01-01',
   *   package: '@aws-lambda-powertools/logger',
   *   downloads: 1234
   * }
   * ```
   *
   * @param options - The options for getting the download count.
   * @returns The download count for the given packages on the last available day.
   */
  getLastDay(
    options: GetLastDayDownloadCountOptions
  ): Promise<NpmAPIPointResponse>;
  /**
   * Get the download count for the last 30 available days.
   *
   * Depending on the time of day, this may include the current day or
   * start on the day before (in GMT).
   *
   * @example
   * ```ts
   * client.getLastMonth({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   * });
   * ```
   *
   * The response will be an array of objects, one for each
   * package, with the following shape:
   *
   * @example
   * ```ts
   * {
   *   start: '2020-01-01',
   *   end: '2020-01-01',
   *   package: '@aws-lambda-powertools/logger',
   *   downloads: 1234
   * }
   * ```
   *
   * @param options - The options for getting the download count.
   * @returns The download count for the given packages on the last 30 available days.
   */
  getLastMonth(
    options: GetLastMonthDownloadCountOptions
  ): Promise<NpmAPIPointResponse>;
  /**
   * Get the download count for the last 7 available days.
   *
   * Depending on the time of day, this may start on the current day or
   * the day before (in GMT).
   *
   * @example
   * ```ts
   * client.getLastWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   * });
   * ```
   *
   * The response will be an array of objects, one for each
   * package, with the following shape:
   *
   * @example
   * ```ts
   * {
   *   start: '2020-01-01',
   *   end: '2020-01-01',
   *   package: '@aws-lambda-powertools/logger',
   *   downloads: 1234
   * }
   * ```
   *
   * @param options - The options for getting the download count.
   * @returns The download count for the given packages on the last 7 available days.
   */
  getLastWeek(
    options: GetLastWeekDownloadCountOptions
  ): Promise<NpmAPIPointResponse>;
  /**
   * Get the download count for the given packages on the given month.
   *
   * @note This method is not yet implemented.
   */
  getMonth(): Promise<void>;
  /**
   * Get the download count for the given packages on a given week.
   *
   * You can use a week number (i.e. W01-W52), an ISO week (i.e. `2023W01`)
   * or a date (i.e. 2020-01-01). In the latter case, the week will be
   * calculated based on the date.
   *
   * By default, the week will start on Monday and end on Sunday, but you
   * can change this by passing the `startOfWeek` option.
   *
   * @example
   * ```ts
   * // week 1 of the current year
   * client.getWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   week: 'W1',
   * });
   * // week 1 of 2020
   * client.getWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   week: '2020W1',
   * });
   * // week that includes 2020-01-01
   * client.getWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   week: '2020-01-01',
   * });
   * // week that includes 2020-01-01, starting on Sunday
   * client.getWeek({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   week: '2020-01-01',
   *   startOfWeek: 'sunday',
   * });
   * ```
   *
   * In all cases, the response will be an array of objects, one for each
   * package, with the following shape:
   *
   * @example
   * ```ts
   * {
   *   downloads: 1234;
   *   start: '2020-01-01';
   *   end: '2020-01-07';
   *   package: '@aws-lambda-powertools/logger';
   * }
   * ```
   *
   * @param options The options for getting the download count.
   * @returns The download count for the given packages on the given week.
   */
  getWeek(options: GetWeekDownloadCountOptions): Promise<NpmAPIPointResponse>;
}

/**
 * The configuration options for the NpmDownloadCountClient
 */
type NpmDownloadCountClientConfig = {
  /**
   * The hostname to use for all requests
   * @default 'api.npmjs.org'
   */
  hostname?: string;
  /**
   * The basePath to use for all requests
   * @default '/downloads'
   */
  basePath?: string;
  /**
   * The protocol to use for all requests
   * @default 'https'
   */
  protocol?: 'http' | 'https';
  /**
   * Options for customizing the services used by the API client.
   * This is useful for testing as it allows you to mock the services.
   */
  customServices?: {
    /**
     * The request service which is used to make requests to the
     * API endpoint
     * @default new RequestService()
     */
    requestService?: RequestService;
  };
};

/**
 * The configuration options for retrying a request if it fails
 */
type RequestRetry = {
  /**
   * The number of times a request has been retried
   */
  count: number;
  /**
   * The delay in milliseconds to wait before retrying a request
   */
  delay: number;
  /**
   * The number of times to retry a request
   */
  maxRetries: number;
};

/**
 * The type of request to make to the API
 *
 * If you want to get the download count for a single day, use `point`,
 * otherwise use `range`. Range requests will return the download count
 * for each day in the range.
 */
type RequestType = 'point' | 'range';

/**
 * The keyword to get the download count for.
 */
type RequestKeyword = 'last-day' | 'last-week' | 'last-month';

/**
 * Base interface for options for assembling the request path
 * @internal
 */
interface MakeRequestPathOptionsBase {
  /**
   * The packages to get the download count for.
   * @example ['@aws-lambda-powertools/logger']
   */
  packages: string[];
  /**
   * The type of request to make to the API
   */
  requestType: RequestType;
}

/**
 * The options for assembling the request path for the API
 * using a keyword
 * @internal
 */
interface MakeRequestPathOptionsWithKeyword extends MakeRequestPathOptionsBase {
  /**
   * The keyword to get the download count for.
   */
  keyword: RequestKeyword;
  date?: never;
  startDate?: never;
  endDate?: never;
}

/**
 * The options for assembling the request path for the API
 * using a single date
 * @internal
 */
interface MakeRequestPathOptionsWithSingleDate
  extends MakeRequestPathOptionsBase {
  /**
   * The date to get the download count for.
   * @example new Date('2020-01-01')
   */
  date: Date;
  keyword?: never;
  startDate?: never;
  endDate?: never;
}

/**
 * The options for assembling the request path for the API
 * using a date range
 * @internal
 */
interface MakeRequestPathOptionsWithDateRange
  extends MakeRequestPathOptionsBase {
  /**
   * The start date to get the download count for.
   * @example new Date('2020-01-01')
   */
  startDate: Date;
  /**
   * The end date to get the download count for.
   * @example new Date('2020-01-31')
   */
  endDate: Date;
  keyword?: never;
  date?: never;
}

/**
 * The options for assembling the request path for the API
 * @internal
 */
type MakeRequestPathOptions =
  | MakeRequestPathOptionsWithKeyword
  | MakeRequestPathOptionsWithSingleDate
  | MakeRequestPathOptionsWithDateRange;

/**
 * The options to use when parsing an object
 * @internal
 */
type ParseObjectOptions<SomeSchema extends ZodType> = {
  /**
   * The zod schema to use to parse the object
   */
  schema: SomeSchema;
  /**
   * The object to parse
   */
  object: unknown;
};

/**
 * The output of the parseResponse function
 * @internal
 */
type ParseObjectOutput<T extends ZodType> = z.infer<T>;

/**
 * The options to use when getting the download count for a week
 */
type GetStartAndEndDatesForWeekOptions = {
  /**
   * The week to get the start and end dates for
   * @example '2020W1'
   */
  week: GetWeekDownloadCountOptions['week'];
  /**
   * The day of the week to start the week on
   * @default 'monday'
   */
  startOfWeek?: GetWeekDownloadCountOptions['startOfWeek'];
};

/**
 * The output of the getStartAndEndDatesForWeek function
 */
type GetStartAndEndDatesForWeekOutput = {
  /**
   * The start date of the week
   * @example new Date('2020-01-01')
   */
  startDate: Date;
  /**
   * The end date of the week
   * @example new Date('2020-01-07')
   */
  endDate: Date;
};

export type {
  NpmDownloadCountClient,
  NpmDownloadCountClientConfig,
  RequestRetry,
  GetDayDownloadCountOptions,
  GetWeekDownloadCountOptions,
  GetWeekDailyDownloadCountOptions,
  GetLastDayDownloadCountOptions,
  GetLastWeekDownloadCountOptions,
  GetLastMonthDownloadCountOptions,
  NpmAPIPointResponse,
  NpmAPIRangeResponse,
  RequestType,
  MakeRequestPathOptions,
  NpmAPIResponse,
  ParseObjectOptions,
  ParseObjectOutput,
  GetStartAndEndDatesForWeekOptions,
  GetStartAndEndDatesForWeekOutput,
  GetLastWeekDailyDownloadCountOptions,
  GetLastMonthDailyDownloadCountOptions,
  GetBetweenDatesDownloadCountOptions,
};

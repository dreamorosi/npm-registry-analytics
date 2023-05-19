import { RequestService } from './RequestService';
import {
  parseISO,
  startOfWeek as getStartOfWeek,
  endOfWeek as getEndOfWeek,
} from 'date-fns';
import { NpmAPIPointResponseSchema } from './schemas/NpmAPIPointResponse';
import { NpmAPIRangeResponseSchema } from './schemas/NpmAPIRangeResponse';
import { ValidationError } from './errors';
import type { ZodType, ZodError } from 'zod';
import type { RequestService as IRequestService } from './types/RequestService';
import type {
  NpmDownloadCountClient as INpmDownloadCountClient,
  NpmDownloadCountClientConfig,
  GetDayDownloadCountOptions,
  GetWeekDownloadCountOptions,
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
  GetWeekDailyDownloadCountOptions,
  GetStartAndEndDatesForWeekOutput,
  GetStartAndEndDatesForWeekOptions,
  GetLastWeekDailyDownloadCountOptions,
  GetLastMonthDailyDownloadCountOptions,
  GetBetweenDatesDownloadCountOptions,
} from './types/NpmDownloadCountClient';

/**
 * A client for the npm package download API.
 *
 * The client allows to retrieve the download count for a given day, week, month, or a relative
 * period of time (e.g. last 7 days).
 *
 * @example
 * ```ts
 * // get the download count on 2020-01-01
 * client.getDay({
 *  packages: [
 *   '@aws-lambda-powertools/logger',
 *  ],
 *  date: '2020-01-01',
 * });
 * ```
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
 * You can also use the client to get the daily download count for a given package in a period of time.
 *
 * @see [API Documentation](https://github.com/npm/registry/blob/master/docs/download-counts.md)
 */
class NpmDownloadCountClient implements INpmDownloadCountClient {
  /**
   * The request service which is used to make requests to the API
   * @default new RequestService()
   */
  #requestService: IRequestService;

  public constructor(config?: NpmDownloadCountClientConfig) {
    this.#requestService =
      config?.customServices?.requestService || new RequestService(config);
  }

  /**
   * Get the download count for the given packages between the given dates.
   *
   * @example
   * ```ts
   * client.getBetweenDates({
   *   packages: [
   *     '@aws-lambda-powertools/logger',
   *   ],
   *   startDate: '2020-01-01',
   *   endDate: '2020-01-15',
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
  public async getBetweenDates(
    options: GetBetweenDatesDownloadCountOptions
  ): Promise<NpmAPIPointResponse> {
    const { packages, start, end } = options;
    const paths = this.#makeRequestPaths({
      packages,
      startDate: start instanceof Date ? start : parseISO(start),
      endDate: end instanceof Date ? end : parseISO(end),
      requestType: 'point',
    });

    return await this.#request(paths, 'point');
  }

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
  public async getDailyDownloadsForLastMonth(
    options: GetLastMonthDailyDownloadCountOptions
  ): Promise<NpmAPIRangeResponse> {
    const { packages } = options;
    const paths = this.#makeRequestPaths({
      packages,
      keyword: 'last-month',
      requestType: 'range',
    });

    return await this.#request(paths, 'range');
  }

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
  public async getDailyDownloadsForLastWeek(
    options: GetLastWeekDailyDownloadCountOptions
  ): Promise<NpmAPIRangeResponse> {
    const { packages } = options;
    const paths = this.#makeRequestPaths({
      packages,
      keyword: 'last-week',
      requestType: 'range',
    });

    return await this.#request(paths, 'range');
  }

  /**
   * Get the daily downlods for the given packages on a given month.
   *
   * @note This method is not yet implemented.
   */
  public async getDailyDownloadsForMonth(): Promise<void> {
    throw new Error('Method not implemented.');
  }

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
  public async getDailyDownloadsForWeek(
    options: GetWeekDailyDownloadCountOptions
  ): Promise<NpmAPIRangeResponse> {
    const { packages, week, startOfWeek } = options;
    const { startDate, endDate } = this.#getStartAndEndDatesForWeek({
      week,
      startOfWeek,
    });
    const paths = this.#makeRequestPaths({
      packages,
      startDate,
      endDate,
      requestType: 'range',
    });

    return await this.#request(paths, 'range');
  }

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
   *   downloads: 1234,
   *   start: '2020-01-01',
   *   end: '2020-01-01',
   *   package: '@aws-lambda-powertools/logger',
   * }
   * ```
   *
   * @param options - The options for getting the download count.
   * @returns The download count for the given packages on the given date.
   */
  public async getDay(
    options: GetDayDownloadCountOptions
  ): Promise<NpmAPIPointResponse> {
    const { packages, date } = options;
    const paths = this.#makeRequestPaths({
      packages,
      date: new Date(date),
      requestType: 'point',
    });

    return await this.#request(paths, 'point');
  }

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
  public async getLastDay(
    options: GetLastDayDownloadCountOptions
  ): Promise<NpmAPIPointResponse> {
    const { packages } = options;
    const paths = this.#makeRequestPaths({
      packages,
      keyword: 'last-day',
      requestType: 'point',
    });

    return await this.#request(paths, 'point');
  }

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
  public async getLastMonth(
    options: GetLastMonthDownloadCountOptions
  ): Promise<NpmAPIPointResponse> {
    const { packages } = options;
    const paths = this.#makeRequestPaths({
      packages,
      keyword: 'last-month',
      requestType: 'point',
    });

    return await this.#request(paths, 'point');
  }

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
  public async getLastWeek(
    options: GetLastWeekDownloadCountOptions
  ): Promise<NpmAPIPointResponse> {
    const { packages } = options;
    const paths = this.#makeRequestPaths({
      packages,
      keyword: 'last-week',
      requestType: 'point',
    });

    return await this.#request(paths, 'point');
  }

  /**
   * Get the download count for the given packages on the given month.
   *
   * @note This method is not yet implemented.
   */
  public async getMonth(): Promise<void> {
    throw new Error('Method not implemented.');
  }

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
   *   downloads: 1234,
   *   start: '2020-01-01',
   *   end: '2020-01-07',
   *   package: '@aws-lambda-powertools/logger',
   * }
   * ```
   *
   * @param options - The options for getting the download count.
   * @returns The download count for the given packages on the given week.
   */
  public async getWeek(
    options: GetWeekDownloadCountOptions
  ): Promise<NpmAPIPointResponse> {
    const { packages, week, startOfWeek } = options;
    const { startDate, endDate } = this.#getStartAndEndDatesForWeek({
      week,
      startOfWeek,
    });
    const paths = this.#makeRequestPaths({
      packages,
      startDate,
      endDate,
      requestType: 'point',
    });

    return await this.#request(paths, 'point');
  }

  /**
   * Make requests to the npm API for the given paths.
   *
   * @param options - Options like the packages to get stats for and the date
   * @returns A list of stats for the given packages
   */
  async #request<Type extends RequestType>(
    paths: string[],
    type: Type
  ): Promise<NpmAPIResponse<Type>> {
    try {
      const responses = await Promise.all(
        paths.map((path) => this.#requestService.request({ path }))
      );
      const parsedResponses = responses.map((response) =>
        this.#parseObjectWithSchema({
          schema:
            type === 'point'
              ? NpmAPIPointResponseSchema
              : NpmAPIRangeResponseSchema,
          object: response,
        })
      );

      return parsedResponses as NpmAPIResponse<Type>;
    } catch (err) {
      throw new Error('Unable to get downloads stats from the npm API', {
        cause: err,
      });
    }
  }

  /**
   * Parses an object using the provided schema and throws an error if unable
   * to parse it or when the parsing/validation fails.
   *
   * @param options - Options for parsing, includes the schema and the object
   * @returns The parsed object
   */
  #parseObjectWithSchema<SomeSchema extends ZodType>(
    options: ParseObjectOptions<SomeSchema>
  ): ParseObjectOutput<typeof options.schema> {
    const { schema, object } = options;
    try {
      return schema.parse(object);
    } catch (err) {
      throw new ValidationError(
        `Object shape is not valid.`,
        (err as ZodError).errors,
        {
          cause: err,
        }
      );
    }
  }

  /**
   * Build the request paths for the given packages and dates range.
   *
   * @param options - Options for creating the request paths
   * @returns A list of paths to request for the given packages
   */
  #makeRequestPaths(options: MakeRequestPathOptions): string[] {
    let when: string;
    if (options?.keyword) {
      when = options.keyword;
    } else if (options.date) {
      when = `${options.date.getFullYear()}-${
        options.date.getMonth() + 1
      }-${options.date.getDate()}`;
    } else {
      when = `${options.startDate.getFullYear()}-${
        options.startDate.getMonth() + 1
      }-${options.startDate.getDate()}:${options.endDate.getFullYear()}-${
        options.endDate.getMonth() + 1
      }-${options.endDate.getDate()}`;
    }

    return options.packages.map(
      (packageName) => `/${options.requestType}/${when}/${packageName}`
    );
  }

  /**
   * Get the start and end dates for the given week.
   *
   * @param options - Options for getting the start and end dates
   * @returns The start and end dates for the given week
   */
  #getStartAndEndDatesForWeek(
    options: GetStartAndEndDatesForWeekOptions
  ): GetStartAndEndDatesForWeekOutput {
    const { week, startOfWeek } = options;
    let weekDate: Date;
    if (week instanceof Date) {
      weekDate = week;
    } else if (week.toUpperCase().startsWith('W')) {
      const currentYear = new Date().getFullYear();
      weekDate = parseISO(`${currentYear}${week}`);
    } else {
      weekDate = parseISO(week);
    }
    const startDate = getStartOfWeek(weekDate, {
      weekStartsOn: startOfWeek === 'sunday' ? 0 : 1,
    });
    const endDate = getEndOfWeek(weekDate, {
      weekStartsOn: startOfWeek === 'sunday' ? 0 : 1,
    });

    return { startDate, endDate };
  }
}

export { NpmDownloadCountClient };

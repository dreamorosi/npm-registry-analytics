import { fetch, setGlobalOrigin } from 'undici';
import type { RequestRetry } from './types/NpmRegistryClient';
import type {
  RequestService as IRequestService,
  RequestOptions,
  RequestServiceConfig,
} from './types/RequestService';

class RequestService implements IRequestService {
  /**
   * The configuration options for retrying a request if the session ID is invalid.
   * By default, the request will be retried 3 times with a delay of 1 second before
   * throwing an error.
   */
  readonly #requestRetry: RequestRetry;
  /**
   * The basePath to use for all requests
   * @example
   * ```ts
   * '/downloads'
   * ```
   */
  readonly #basePath: string;

  public constructor(config?: RequestServiceConfig) {
    setGlobalOrigin(
      `${config?.protocol || 'https'}://${config?.hostname || 'api.npmjs.org'}`
    );

    this.#basePath = config?.basePath || '/downloads';

    this.#requestRetry = {
      count: 0,
      maxRetries:
        config?.requestRetryConfig?.maxRetries !== undefined
          ? config?.requestRetryConfig?.maxRetries
          : 3,
      delay:
        config?.requestRetryConfig?.delay !== undefined
          ? config?.requestRetryConfig?.delay
          : 1000,
    };
  }

  /**
   * Makes a request to the API endpoint. If the request fails it
   * retries for a number of times with a delay between each retry
   * before eventually throwing an error.
   *
   * @param body - The body to send to the API endpoint
   * @returns The response from the API endpoint
   */
  public async request(options?: RequestOptions): Promise<unknown> {
    try {
      const query = options?.queryParams
        ? `?${this.#serializeQueryParams(options.queryParams)}`
        : '';
      const path = options?.path || '';

      const response = await fetch(`${this.#basePath}${path}${query}`, {
        method: options?.method || 'GET',
        body: options?.body,
      });
      if (!response.ok) {
        const isRetriableCode = [500, 502, 503, 504].includes(response.status);
        if (
          isRetriableCode &&
          this.#requestRetry.count < this.#requestRetry.maxRetries
        ) {
          this.#requestRetry.count += 1;
          await new Promise((resolve) =>
            setTimeout(resolve, this.#requestRetry.delay)
          );

          return this.request(options);
        } else if (
          isRetriableCode &&
          this.#requestRetry.count >= this.#requestRetry.maxRetries
        ) {
          throw new Error(
            `API endpoint failed to provide a valid response, max retries exceeded`
          );
        }
        // Reset the retry count for future requests
        this.#requestRetry.count = 0;
        throw new Error(`API endpoint returned status code ${response.status}`);
      }
      // Reset the retry count for future requests
      this.#requestRetry.count = 0;

      try {
        const body = await response.json();

        return body;
      } catch (err) {
        throw new Error('API endpoint returned a non JSON response', {
          cause: err,
        });
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Serializes a key value object of query parameters into a URLSearchParams object.
   * Removes any undefined or null values, and convers numbers to strings. Strings are
   * encoded using encodeURI.
   *
   * @param params - An object of key value pairs to serialize as query parameters
   * @returns An instance of URLSearchParams with the serialized parameters
   */
  #serializeQueryParams(params: Record<string, unknown>): URLSearchParams {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'number' || value instanceof BigInt) {
        query.append(key, `${value}`);
      }
      if (typeof value === 'string') {
        query.append(key, encodeURI(value));
      }
      if (value instanceof Date) {
        query.append(key, value.toISOString().split('T')[0]);
      }
    });

    return query;
  }
}

export { RequestService };

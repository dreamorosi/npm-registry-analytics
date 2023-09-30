import type { BodyInit } from 'undici';
import type {
  NpmRegistryDownloadCountClientConfig,
  RequestRetry,
} from './NpmRegistryDownloadCountClient';

/**
 * List of HTTP methods that can be used in a request.
 */
type HttpMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';

/**
 * Request options that can be used to customize the request.
 */
type RequestOptions = {
  /**
   * The path of the request.
   * @example /point/2022-01-01:2022-01-03/@aws-lambda-powertools/logger
   */
  path?: string;
  /**
   * The HTTP method of the request.
   * @example GET
   */
  method?: HttpMethod;
  /**
   * The body of the request.
   */
  body?: BodyInit;
  /**
   * An object containing the query parameters of the request.
   */
  queryParams?: Record<string, unknown>;
};

/**
 * Interface for a service that can make HTTP requests (it's simple).
 */
interface RequestService {
  request(options: RequestOptions): Promise<unknown>;
}

/**
 * Configs for the request service
 */
interface RequestServiceConfig
  extends Omit<NpmRegistryDownloadCountClientConfig, 'customServices'> {
  /**
   * The configuration options for retrying a request if it fails.
   * By default, the request will be retried 3 times with a delay of 1 second before
   * throwing an error.
   */
  requestRetryConfig?: Omit<RequestRetry, 'count'>;
}

export { RequestService, RequestServiceConfig, RequestOptions, HttpMethod };

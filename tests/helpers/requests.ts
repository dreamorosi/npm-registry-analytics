import type { MockInterceptor } from 'undici/types/mock-interceptor';
import type {
  HttpMethod,
  RequestServiceConfig,
} from '../../src/types/RequestService';
import { RequestService } from '../../src/RequestService';

type GetRequestMatcherOptions = {
  /**
   * HTTP method to match
   */
  method?: HttpMethod;
  /**
   * Path to match
   */
  path?: string;
};

/**
 * Get a request matcher for the mock interceptor with defaults
 *
 * @example
 * ```ts
 * {
 *   path: '/api/download-counts',
 *   method: 'GET',
 * }
 * ```
 *
 * @param options Options to override the defaults
 * @returns The options to pass to the `intercept` method of the mock interceptor
 */
const getRequestMatcher = (
  options: GetRequestMatcherOptions = {}
): MockInterceptor.Options => {
  const { method, path, ...rest } = options;
  const requestMatcher = {
    method: method || 'GET',
    path: path || '/downloads',
    ...rest,
  };

  return requestMatcher;
};

/**
 * Get a dummy request service, optionally by passing a session service
 * @param sessionService An optional session service to use
 * @returns A dummy request service
 */
const getDummyRequestService = (
  requestRetryConfig?: RequestServiceConfig['requestRetryConfig']
): RequestService =>
  new RequestService({
    requestRetryConfig,
  });

export { getRequestMatcher, getDummyRequestService };

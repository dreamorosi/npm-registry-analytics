import { beforeEach, afterEach, describe, it, expect } from 'vitest';
import { getDummyRequestService, getRequestMatcher } from '../helpers';
import { setGlobalDispatcher, MockAgent } from 'undici';
import type { Interceptable } from 'undici';

let mockAgent: MockAgent;
let mockPool: Interceptable;

beforeEach(() => {
  mockAgent = new MockAgent({
    keepAliveTimeout: 10,
    keepAliveMaxTimeout: 10,
  });
  mockAgent.disableNetConnect();
  setGlobalDispatcher(mockAgent);
  mockPool = mockAgent.get('https://api.npmjs.org');
});

afterEach(async () => {
  await mockAgent.close();
});

describe('Class: RequestService', () => {
  describe('Method: request', () => {
    it('it makes a request, then returns successfully if the remote returns the expected response shape', async () => {
      // Prepare
      mockPool
        .intercept(
          getRequestMatcher({
            path: '/downloads',
          })
        )
        .reply(200, { result: 'success' });
      const requestService = getDummyRequestService();

      // Act
      const response = await requestService.request();

      // Assess
      expect(response).toEqual({ result: 'success' });
      expect(mockAgent.assertNoPendingInterceptors()).toBeUndefined();
    });
    it('makes a request with the provided path', async () => {
      // Prepare
      mockPool
        .intercept(
          getRequestMatcher({
            path: '/downloads/some/path',
          })
        )
        .reply(200, {});
      const requestService = getDummyRequestService();

      // Act
      await requestService.request({ path: '/some/path' });

      // Assess
      expect(mockAgent.assertNoPendingInterceptors()).toBeUndefined();
    });
    it.each([
      { queryparams: {}, expectedQs: '' },
      { queryParams: { foo: undefined, bar: null }, expectedQs: '' },
      {
        queryParams: { foo: 'bar@', baz: 1, bar: BigInt(42) },
        expectedQs: '?foo=bar%40&baz=1',
      },
      {
        queryParams: { foo: new Date('2021-01-01') },
        expectedQs: '?foo=2021-01-01',
      },
    ])(
      'it makes a request with the correct query params',
      async ({ queryParams, expectedQs }) => {
        // Prepare
        mockPool
          .intercept(
            getRequestMatcher({
              path: `/downloads${expectedQs}`,
            })
          )
          .reply(200, {});
        const requestService = getDummyRequestService();

        // Act
        await requestService.request({ queryParams });

        // Assess
        expect(mockAgent.assertNoPendingInterceptors()).toBeUndefined();
      }
    );
    it('if a retriable error code is returned, it retries, then throws if unable multiple times', async () => {
      // Prepare
      mockPool
        .intercept(
          getRequestMatcher({
            path: '/downloads',
          })
        )
        .reply(500)
        .times(3); // First request, then 2 retries
      const requestService = getDummyRequestService({
        maxRetries: 2,
        delay: 0,
      });

      // Act & Assess
      await expect(() => requestService.request()).rejects.toThrowError(
        'API endpoint failed to provide a valid response, max retries exceeded'
      );
      expect(mockAgent.assertNoPendingInterceptors()).toBeUndefined();
    });
    it('throws if the remote returns a non JSON response', async () => {
      // Prepare
      mockPool
        .intercept(
          getRequestMatcher({
            path: '/downloads',
          })
        )
        .reply(200, 'not json');
      const requestService = getDummyRequestService();

      // Act & Assess
      await expect(() => requestService.request()).rejects.toThrowError(
        'API endpoint returned a non JSON response'
      );
      expect(mockAgent.assertNoPendingInterceptors()).toBeUndefined();
    });
    it('throws if the remote is down', async () => {
      // Here we're using the real SessionService, because we want to test the
      // behavior of instantiating a new SessionService when none is provided.
      // This means we need to mock the full request chain, including the
      // sessionId request.

      // Prepare
      mockPool
        .intercept(
          getRequestMatcher({
            path: '/downloads',
          })
        )
        .reply(401)
        .times(1);
      const requestService = getDummyRequestService();

      // Act & Assess
      await expect(requestService.request()).rejects.toThrowError(
        'API endpoint returned status code 401'
      );
      expect(mockAgent.assertNoPendingInterceptors()).toBeUndefined();
    });
  });
});

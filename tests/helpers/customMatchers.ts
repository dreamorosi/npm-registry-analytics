import { expect } from 'vitest';
import type {
  NpmAPIPointResponse,
  NpmAPIRangeResponse,
} from '../../src/types/NpmRegistryDownloadCountClient';

expect.extend({
  /**
   * Custom matcher that checks if the received set of responses matches the expected set.
   *
   * @param received - The received set of responses.
   * @param expected - The expected set of responses.
   */
  toMatchResponses(
    received: NpmAPIPointResponse | NpmAPIRangeResponse,
    expected: NpmAPIPointResponse | NpmAPIRangeResponse
  ) {
    const { isNot } = this;
    const messageSuffix = `Expected to${isNot ? ' not' : ''} match responses`;

    const sortedReceived = received.sort((a, b) => {
      return a.package.localeCompare(b.package);
    });
    const sortedExpected = expected.sort((a, b) => {
      return a.package.localeCompare(b.package);
    });

    const pass = this.equals(sortedReceived, sortedExpected);

    return {
      pass,
      message: () =>
        `${this.utils.matcherHint('toMatchResponses', undefined, undefined, {
          comment: messageSuffix,
        })}\n\n` +
        `Expected: ${this.utils.printExpected(sortedExpected)}\n` +
        `Received: ${this.utils.printReceived(sortedReceived)}`,
      expected,
      actual: received,
    };
  },
});

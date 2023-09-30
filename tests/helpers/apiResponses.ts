import { vi } from 'vitest';
import { add } from 'date-fns';
import { randomInt } from 'node:crypto';
import type { RequestService } from '../../src/types/RequestService';
import type {
  RequestType,
  NpmAPIResponse,
} from '../../src/types/NpmRegistryDownloadCountClient';

type AddMockResponsesOptions = {
  requestService: RequestService;
  startDate: Date;
  delta: number;
  packages: string[];
};

const addMockResponses = <Type extends RequestType>(
  options: AddMockResponsesOptions,
  type: RequestType
): NpmAPIResponse<Type> => {
  const { requestService, startDate, delta, packages } = options;
  const endDate = add(startDate, { days: delta });

  const mockResponses = packages.map((packageName) => {
    if (type === 'point') {
      return {
        downloads: randomInt(0, 10000),
        start: startDate.toISOString().slice(0, 10),
        end: endDate.toISOString().slice(0, 10),
        package: packageName,
      };
    } else {
      const days = Array.from({ length: delta }).map((_, idx) => {
        return {
          downloads: randomInt(0, 10000),
          day: add(startDate, { days: idx }).toISOString().slice(0, 10),
        };
      });

      return {
        start: startDate.toISOString().slice(0, 10),
        end: endDate.toISOString().slice(0, 10),
        package: packageName,
        downloads: days,
      };
    }
  });

  mockResponses.forEach((mockResponse) => {
    vi.spyOn(requestService, 'request').mockResolvedValueOnce(mockResponse);
  });

  return mockResponses as NpmAPIResponse<Type>;
};

export { addMockResponses };

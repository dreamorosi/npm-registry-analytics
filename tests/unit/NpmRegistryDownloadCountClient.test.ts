import { randomInt } from 'node:crypto';
import { describe, it, expect, vi } from 'vitest';
import { getDummyRequestService, addMockResponses } from '../helpers';
import { NpmRegistryDownloadCountClient } from '../../src/NpmRegistryDownloadCountClient';

describe('Class: NpmRegistryDownloadCountClient', () => {
  describe('Method: constructor', () => {
    it('returns an instance of NpmRegistryDownloadCountClient', () => {
      // Act
      const client = new NpmRegistryDownloadCountClient();

      // Assess
      expect(client).toBeInstanceOf(NpmRegistryDownloadCountClient);
    });
  });
  describe('Method: getBetweenDates', () => {
    it.each([
      { start: '2023-05-01', end: '2023-05-15' },
      { start: new Date('2023-05-01'), end: new Date('2023-05-15') },
    ])('gets the download count for a package', async ({ start, end }) => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: start instanceof Date ? start : new Date(start),
          delta: 14,
          packages: ['@aws-lambda-powertools/logger'],
        },
        'point'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getBetweenDates({
        packages: ['@aws-lambda-powertools/logger'],
        start,
        end,
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
      expect(requestService.request).toHaveBeenCalledWith({
        path: '/point/2023-5-1:2023-5-15/@aws-lambda-powertools/logger',
      });
    });
  });
  describe('Method: getDailyDownloadsForLastMonth', () => {
    it('gets the download count for a package', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 30,
          packages: ['@aws-lambda-powertools/logger'],
        },
        'range'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getDailyDownloadsForLastMonth({
        packages: ['@aws-lambda-powertools/logger'],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
      expect(requestService.request).toHaveBeenCalledWith({
        path: '/range/last-month/@aws-lambda-powertools/logger',
      });
    });
    it('gets the download count for multiple packages', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 30,
          packages: [
            '@aws-lambda-powertools/logger',
            '@aws-lambda-powertools/metrics',
          ],
        },
        'range'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getDailyDownloadsForLastMonth({
        packages: [
          '@aws-lambda-powertools/logger',
          '@aws-lambda-powertools/metrics',
        ],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
    });
  });
  describe('Method: getDailyDownloadsForLastWeek', () => {
    it('gets the download count for a package', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 7,
          packages: ['@aws-lambda-powertools/logger'],
        },
        'range'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getDailyDownloadsForLastWeek({
        packages: ['@aws-lambda-powertools/logger'],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
      expect(requestService.request).toHaveBeenCalledWith({
        path: '/range/last-week/@aws-lambda-powertools/logger',
      });
    });
    it('gets the download count for multiple packages', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 7,
          packages: [
            '@aws-lambda-powertools/logger',
            '@aws-lambda-powertools/metrics',
          ],
        },
        'range'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getDailyDownloadsForLastWeek({
        packages: [
          '@aws-lambda-powertools/logger',
          '@aws-lambda-powertools/metrics',
        ],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
    });
  });
  describe('Method: getDailyDownloadsForMonth', () => {
    it.each(['2023-01', '01', '1'])(
      'gets the download count for a package',
      async (month) => {
        // Prepare
        const requestService = getDummyRequestService();
        const expectedResponses = addMockResponses(
          {
            requestService,
            startDate: new Date('2023-01-01'),
            delta: 31,
            packages: ['@aws-lambda-powertools/logger'],
          },
          'range'
        );
        const client = new NpmRegistryDownloadCountClient({
          customServices: {
            requestService,
          },
        });

        // Act
        const response = await client.getDailyDownloadsForMonth({
          packages: ['@aws-lambda-powertools/logger'],
          month,
        });

        // Assess
        expect(response).toMatchResponses(expectedResponses);
        expect(requestService.request).toHaveBeenCalledWith({
          path: '/range/2023-1-1:2023-1-31/@aws-lambda-powertools/logger',
        });
      }
    );
  });
  describe('Method: getDailyDownloadsForWeek', () => {
    it.each(['2023-05-15', new Date('2023-05-15'), '2023W20', 'W20'])(
      'gets the download count for a package',
      async (week) => {
        // Prepare
        const requestService = getDummyRequestService();
        const expectedResponses = addMockResponses(
          {
            requestService,
            startDate: new Date('2023-05-15'),
            delta: 7,
            packages: ['@aws-lambda-powertools/logger'],
          },
          'range'
        );
        const client = new NpmRegistryDownloadCountClient({
          customServices: {
            requestService,
          },
        });
        const startOfWeek = randomInt(0, 2) === 0 ? 'monday' : 'sunday';

        // Act
        const response = await client.getDailyDownloadsForWeek({
          packages: ['@aws-lambda-powertools/logger'],
          week,
          startOfWeek,
        });

        // Assess
        expect(response).toMatchResponses(expectedResponses);
        expect(requestService.request).toHaveBeenCalledWith({
          path: `/range/2023-5-1${startOfWeek === 'monday' ? 5 : 4}:2023-5-2${
            startOfWeek === 'monday' ? 1 : 0
          }/@aws-lambda-powertools/logger`,
        });
      }
    );
    it.each(['2023-05-15', new Date('2023-05-15'), '2023W20', 'W20'])(
      'gets the download count for multiple packages',
      async (week) => {
        // Prepare
        const requestService = getDummyRequestService();
        const expectedResponses = addMockResponses(
          {
            requestService,
            startDate: new Date('2023-05-15'),
            delta: 7,
            packages: [
              '@aws-lambda-powertools/logger',
              '@aws-lambda-powertools/metrics',
            ],
          },
          'range'
        );
        const client = new NpmRegistryDownloadCountClient({
          customServices: {
            requestService,
          },
        });

        // Act
        const response = await client.getDailyDownloadsForWeek({
          packages: [
            '@aws-lambda-powertools/logger',
            '@aws-lambda-powertools/metrics',
          ],
          week,
          startOfWeek: randomInt(0, 2) === 0 ? 'monday' : 'sunday',
        });

        // Assess
        expect(response).toMatchResponses(expectedResponses);
      }
    );
  });
  describe('Method: getDay', () => {
    it('gets the download count for a package', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 0,
          packages: ['@aws-lambda-powertools/logger'],
        },
        'point'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getDay({
        packages: ['@aws-lambda-powertools/logger'],
        date: new Date('2023-05-15'),
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
      expect(requestService.request).toHaveBeenCalledWith({
        path: '/point/2023-5-15/@aws-lambda-powertools/logger',
      });
    });
    it('gets the download count for multiple packages', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 0,
          packages: [
            '@aws-lambda-powertools/logger',
            '@aws-lambda-powertools/metrics',
          ],
        },
        'point'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getDay({
        packages: [
          '@aws-lambda-powertools/logger',
          '@aws-lambda-powertools/metrics',
        ],
        date: new Date('2023-05-08'),
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
    });
    it('returns an error if the response is not valid', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      vi.spyOn(requestService, 'request').mockResolvedValue({
        downloads: 2165,
        start: '2023-05-08',
        end: '2023-05-14',
      });
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act & Assess
      await expect(
        client.getDay({
          packages: ['@aws-lambda-powertools/logger'],
          date: new Date('2023-05-15'),
        })
      ).rejects.toThrow('Unable to get downloads stats from the npm API');
    });
  });
  describe('Method: getLastDay', () => {
    it('gets the download count for a package', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 0,
          packages: ['@aws-lambda-powertools/logger'],
        },
        'point'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getLastDay({
        packages: ['@aws-lambda-powertools/logger'],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
      expect(requestService.request).toHaveBeenCalledWith({
        path: '/point/last-day/@aws-lambda-powertools/logger',
      });
    });
    it('gets the download count for multiple packages', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 0,
          packages: [
            '@aws-lambda-powertools/logger',
            '@aws-lambda-powertools/metrics',
          ],
        },
        'point'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getLastDay({
        packages: [
          '@aws-lambda-powertools/logger',
          '@aws-lambda-powertools/metrics',
        ],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
    });
  });
  describe('Method: getLastMonth', () => {
    it('gets the download count for a package', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 30,
          packages: ['@aws-lambda-powertools/logger'],
        },
        'point'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getLastMonth({
        packages: ['@aws-lambda-powertools/logger'],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
      expect(requestService.request).toHaveBeenCalledWith({
        path: '/point/last-month/@aws-lambda-powertools/logger',
      });
    });
    it('gets the download count for multiple packages', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 30,
          packages: [
            '@aws-lambda-powertools/logger',
            '@aws-lambda-powertools/metrics',
          ],
        },
        'point'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getLastMonth({
        packages: [
          '@aws-lambda-powertools/logger',
          '@aws-lambda-powertools/metrics',
        ],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
    });
  });
  describe('Method: getLastWeek', () => {
    it('gets the download count for a package', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 7,
          packages: ['@aws-lambda-powertools/logger'],
        },
        'point'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getLastWeek({
        packages: ['@aws-lambda-powertools/logger'],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
      expect(requestService.request).toHaveBeenCalledWith({
        path: '/point/last-week/@aws-lambda-powertools/logger',
      });
    });
    it('gets the download count for multiple packages', async () => {
      // Prepare
      const requestService = getDummyRequestService();
      const expectedResponses = addMockResponses(
        {
          requestService,
          startDate: new Date('2023-05-15'),
          delta: 7,
          packages: [
            '@aws-lambda-powertools/logger',
            '@aws-lambda-powertools/metrics',
          ],
        },
        'point'
      );
      const client = new NpmRegistryDownloadCountClient({
        customServices: {
          requestService,
        },
      });

      // Act
      const response = await client.getLastWeek({
        packages: [
          '@aws-lambda-powertools/logger',
          '@aws-lambda-powertools/metrics',
        ],
      });

      // Assess
      expect(response).toMatchResponses(expectedResponses);
    });
  });
  describe('Method: getMonth', () => {
    it.each(['2023-01', '01', '1'])(
      'gets the download count for a package',
      async (month) => {
        // Prepare
        const requestService = getDummyRequestService();
        const expectedResponses = addMockResponses(
          {
            requestService,
            startDate: new Date('2023-01-01'),
            delta: 31,
            packages: ['@aws-lambda-powertools/logger'],
          },
          'point'
        );
        const client = new NpmRegistryDownloadCountClient({
          customServices: {
            requestService,
          },
        });

        // Act
        const response = await client.getMonth({
          packages: ['@aws-lambda-powertools/logger'],
          month,
        });

        // Assess
        expect(response).toMatchResponses(expectedResponses);
        expect(requestService.request).toHaveBeenCalledWith({
          path: '/point/2023-1-1:2023-1-31/@aws-lambda-powertools/logger',
        });
      }
    );
  });
  describe('Method: getWeek', () => {
    it.each(['2023-05-15', new Date('2023-05-15'), '2023W20', 'W20'])(
      'gets the download count for a package',
      async (week) => {
        // Prepare
        const requestService = getDummyRequestService();
        const expectedResponses = addMockResponses(
          {
            requestService,
            startDate: new Date('2023-05-15'),
            delta: 7,
            packages: ['@aws-lambda-powertools/logger'],
          },
          'point'
        );
        const client = new NpmRegistryDownloadCountClient({
          customServices: {
            requestService,
          },
        });
        const startOfWeek = randomInt(0, 2) === 0 ? 'monday' : 'sunday';

        // Act
        const response = await client.getWeek({
          packages: ['@aws-lambda-powertools/logger'],
          week,
          startOfWeek,
        });

        // Assess
        expect(response).toMatchResponses(expectedResponses);
        expect(requestService.request).toHaveBeenCalledWith({
          path: `/point/2023-5-1${startOfWeek === 'monday' ? 5 : 4}:2023-5-2${
            startOfWeek === 'monday' ? 1 : 0
          }/@aws-lambda-powertools/logger`,
        });
      }
    );
    it.each(['2023-05-15', new Date('2023-05-15'), '2023W20', 'W20'])(
      'gets the download count for multiple packages',
      async (week) => {
        // Prepare
        const requestService = getDummyRequestService();
        const expectedResponses = addMockResponses(
          {
            requestService,
            startDate: new Date('2023-05-15'),
            delta: 7,
            packages: [
              '@aws-lambda-powertools/logger',
              '@aws-lambda-powertools/metrics',
            ],
          },
          'point'
        );
        const client = new NpmRegistryDownloadCountClient({
          customServices: {
            requestService,
          },
        });

        // Act
        const response = await client.getWeek({
          packages: [
            '@aws-lambda-powertools/logger',
            '@aws-lambda-powertools/metrics',
          ],
          week,
          startOfWeek: randomInt(0, 2) === 0 ? 'monday' : 'sunday',
        });

        // Assess
        expect(response).toMatchResponses(expectedResponses);
      }
    );
  });
});

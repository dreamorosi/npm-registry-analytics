# npm-registry-download-count

An opinionated client for the npm package download counts API written in TypeScript.

## Install

```bash
npm i npm-registry-download-count@latest
```

## Usage

```typescript
import { NpmRegistryDownloadCountClient } from 'npm-registry-download-count';

// Create a new client
const client = new NpmRegistryDownloadCountClient();

// get download count for a package on a specific day
await client.getDay({
  packages: ['@aws-lambda-powertools/logger'],
  date: '2020-01-01', // Also accepts Date objects
});

// get download count for multiple packages during a week
await client.getWeek({
  packages: ['@aws-lambda-powertools/logger', '@aws-lambda-powertools/core'],
  // Uses the date to determine the week
  // Also accepts Date objects, or 2020-W01
  date: '2020-01-01',
});

// get daily downloads for a package during the last 30 available days
await client.getDailyDownloadsForLastMonth({
  packages: ['@aws-lambda-powertools/logger'],
});
```

The client supports all the methods exposed by the [npm API](https://github.com/npm/registry/blob/master/docs/download-counts.md). Check out the [API documentation](https://dreamorosi.github.io/npm-registry-download-count/classes/NpmRegistryDownloadCountClient.html) for a full list of available methods.

## License

This library is licensed under the MIT-0 License. See the [LICENSE](./LICENSE) file.

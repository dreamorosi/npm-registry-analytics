module.exports = {
  out: 'api',
  exclude: ['**/node_modules/**', '**/*.test.ts', '**/*.json'],
  name: 'npm-registry-download-count',
  excludePrivate: true,
  excludeInternal: true,
  readme: './README.md',
  plugin: ['typedoc-plugin-missing-exports'],
  entryPoints: ['src/index.ts'],
};

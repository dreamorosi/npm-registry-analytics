import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  declaration: true,
  dts: true,
  format: ['cjs', 'esm'],
  target: 'node18',
  treeshake: true,
});

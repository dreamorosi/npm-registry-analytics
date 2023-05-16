import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  declaration: true,
  format: ['cjs'],
  target: 'node18',
  treeshake: true,
});

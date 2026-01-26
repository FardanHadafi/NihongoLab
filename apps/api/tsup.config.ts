import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  bundle: true,
  clean: true,
  outDir: 'dist',
  platform: 'node',
  target: 'node18',
  shims: true,
  noExternal: ['@nihongolab/db', 'pg'],
  banner: {
    js: `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
`,
  },
  esbuildOptions(options) {
    options.alias = {
      '@': './src'
    };
  }
});

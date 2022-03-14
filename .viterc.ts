/// <reference types="vitest" />
import { join } from 'path';
import { defineConfig } from 'vite';

const cwd = (...path: string[]) => join(process.cwd(), ...path);

export default defineConfig({
  build: {
    outDir: cwd('.'),
    lib: {
      entry: cwd('index.ts'),
      formats: ['cjs', 'es'],
      fileName: (format) => {
        if (format === 'cjs') {
          return `index.js`;
        }
        if (format === 'es') {
          return `index.mjs`;
        }
        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: '[name].[ext]',
        preserveModules: true,
        globals: {},
      },
    },
  },

  resolve: {
    alias: {
      '@': cwd(),
    },
  },

  plugins: [
    //
  ],

  test: {
    global: true,
    coverage: {
      excludeNodeModules: true,
      reporter: ['json-summary'],
      reportsDirectory: 'coverage',
      exclude: ['.*.*'],
    },
  },
});

/// <reference types="vitest" />
import typescript from "@rollup/plugin-typescript";
import path from "path";
import ttsc from "ttypescript";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "vite-plugin-netlify-cms",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      treeshake: true,
      preserveEntrySignatures: "exports-only",
      external: ["url", "fs/promises", "path", "vite"],
      output: {
        sourcemap: true,
        exports: "named",
        globals: {
          vite: "vite",
          "fs/promises": "fs",
          path: "path",
        },
      },
    },
  },
  plugins: [
    typescript({
      typescript: ttsc,
      sourceMap: true,
      declaration: true,
      outDir: "dist",
      exclude: ["src/**/*.spec.ts"],
    }),
  ],
  test: {
    environment: "happy-dom",
  },
});

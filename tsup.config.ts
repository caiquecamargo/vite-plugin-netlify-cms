import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  sourcemap: true,
  external: ["url", "fs/promises", "path", "vite"],
  ignoreWatch: ["demo/**/*"]
})
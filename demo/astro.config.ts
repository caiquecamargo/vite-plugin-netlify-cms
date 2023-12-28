import { defineConfig } from 'astro/config';
import DecapCMS from "../dist/index"

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      DecapCMS()
    ]
  }
});

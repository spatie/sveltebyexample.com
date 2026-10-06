import { sveltekit } from "@sveltejs/kit/vite";
import adapter from "@sveltejs/adapter-static";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit({ adapter: adapter({ pages: "public" }) })],
});

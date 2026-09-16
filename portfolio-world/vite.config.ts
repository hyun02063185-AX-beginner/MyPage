import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/MyPage/world/" : "/",
  build: {
    outDir: "../world",
    emptyOutDir: true,
  },
}));

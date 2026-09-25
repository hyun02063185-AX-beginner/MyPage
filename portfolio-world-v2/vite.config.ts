import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/MyPage/world-v2/" : "/",
  build: {
    outDir: "../world-v2",
    emptyOutDir: true,
  },
  server: {
    watch: {
      // A failed local browser session can leave its old profile locked on Windows.
      // It is never source input, so it must not make Vite's watcher fail.
      ignored: ["**/.qa-edge-profile/**"],
    },
  },
}));

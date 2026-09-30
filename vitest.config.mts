import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/?(*.)+(spec|test).?(c|m)[jt]s?(x)"],
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: ["**/*.d.ts", "**/index.tsx"],
    },
  },
});

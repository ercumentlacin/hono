/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["**/src/**/(*.)+(spec|test).+(ts|tsx|js)"],
    coverage: {
      provider: "v8",
      reporter: ["text"],
      "100": true,
      include: ["**/src/**/*.ts"],
      all: true,
    },
  },
});

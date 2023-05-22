import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["src/__e2e__/**/*.test.tsx"],
      environment: "jsdom",
      globals: true,
      setupFiles: "src/__e2e__/setup.ts",
    },
  })
);

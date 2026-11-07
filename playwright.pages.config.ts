import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testDir: "./tests/pages",
  outputDir: "test-results/pages",
  use: { ...base.use, baseURL: "http://127.0.0.1:3200" },
  webServer: {
    command: "npm run preview:pages -- --port=3200",
    url: "http://127.0.0.1:3200/WhiteDent/",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});

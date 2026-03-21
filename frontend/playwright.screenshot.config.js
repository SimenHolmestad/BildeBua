import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "screenshots.spec.js",
  globalSetup: "./tests/e2e/global-setup-screenshots.js",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html"], ["list"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:5100",
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "bash -lc 'source .venv/bin/activate && python3 -m scripts.run_e2e_backend --env-file .env.e2e'",
      url: "http://127.0.0.1:3100/qr_codes/",
      cwd: repoRoot,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: "BACKEND_PORT=3100 npm run dev -- --host 127.0.0.1 --port 5100",
      url: "http://127.0.0.1:5100",
      cwd: __dirname,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});

import { defineConfig, devices } from '@playwright/test'

const instant = { VITE_MOCK_INSTANT: 'true' }

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 800 },
  },
  webServer: [
    {
      command: 'npm run dev',
      cwd: './client',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      env: instant,
    },
    {
      command: 'npm run dev',
      cwd: './cms',
      url: 'http://localhost:5181',
      reuseExistingServer: !process.env.CI,
      env: instant,
    },
    {
      command: 'npm run dev',
      cwd: './admin',
      url: 'http://localhost:5182',
      reuseExistingServer: !process.env.CI,
      env: instant,
    },
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})

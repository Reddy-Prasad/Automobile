import { expect, test } from '@playwright/test'
import { CLIENT } from './helpers.js'

test('vehicle details uses the path parameter and shows the RAV4', async ({ page }) => {
  await page.goto(`${CLIENT}/vehicles/1`)
  await expect(page.getByRole('heading', { name: /2026 Toyota RAV4/i })).toBeVisible({
    timeout: 20_000,
  })
  await expect(page.locator('p').filter({ hasText: 'Stock #N26104' })).toBeVisible()
})

test('a missing id is an empty state, not a spinner that never stops', async ({ page }) => {
  await page.goto(`${CLIENT}/vehicles/101`)
  await expect(page.getByText(/Vehicle not found/i)).toBeVisible({ timeout: 20_000 })
})

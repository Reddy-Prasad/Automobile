import { expect, test } from '@playwright/test'
import { CLIENT, waitForCards } from './helpers.js'

test('vehicle search filters the inventory list', async ({ page }) => {
  await page.goto(`${CLIENT}/vehicles`)
  await waitForCards(page)

  await page.locator('#inventory-search').fill('RAV4')
  await expect(page.getByRole('heading', { name: /2026 Toyota RAV4/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /F-150/i })).toHaveCount(0)
})

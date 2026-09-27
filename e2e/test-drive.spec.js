import { expect, test } from '@playwright/test'
import { CLIENT } from './helpers.js'

test('test drive validates first, then POSTs a booking', async ({ page }) => {
  await page.goto(`${CLIENT}/test-drive`)
  await expect(page.getByRole('heading', { name: /Book a drive/i })).toBeVisible()

  await page.locator('#drive-vehicle').waitFor({ timeout: 20_000 })
  const options = page.locator('#drive-vehicle option')
  await expect(options).not.toHaveCount(1)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const iso = tomorrow.toISOString().slice(0, 10)

  await page.locator('#drive-vehicle').selectOption({ index: 1 })
  await page.locator('#booking-date').fill(iso)
  await page.locator('#booking-time').selectOption({ index: 1 })
  await page.locator('#booking-location').selectOption({ index: 1 })
  await page.locator('#booking-name').fill('Alex Rivera')
  await page.locator('#booking-phone').fill('2145550199')
  await page.getByRole('button', { name: /Submit test drive/i }).click()
  await expect(page.getByText(/Test drive requested/i)).toBeVisible({ timeout: 20_000 })
})

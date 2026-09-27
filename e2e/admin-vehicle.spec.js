import { expect, test } from '@playwright/test'
import { ADMIN, signInWithDemo } from './helpers.js'

test('Admin inventory manager can create a draft vehicle', async ({ page }) => {
  await page.goto(`${ADMIN}/admin/login`)
  await signInWithDemo(page, 'Morgan Ellis')
  await expect(page.getByRole('heading', { name: /Admin dashboard/i })).toBeVisible()
  await page.goto(`${ADMIN}/admin/inventory/new`)
  await expect(page.getByRole('heading', { name: /Create vehicle/i })).toBeVisible({
    timeout: 20_000,
  })

  const stock = `T14${Date.now().toString().slice(-6)}`
  await page.locator('#stockNumber').fill(stock)
  await page.locator('#make').fill('Honda')
  await page.locator('#model').fill('Civic')
  await page.locator('#price').fill('28990')
  await page.getByRole('button', { name: /Save draft/i }).click()
  await expect(page.getByRole('heading', { name: /2026 Honda Civic/i })).toBeVisible({
    timeout: 20_000,
  })
})

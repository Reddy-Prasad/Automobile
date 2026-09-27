import { expect, test } from '@playwright/test'
import { CLIENT } from './helpers.js'

test('finance calculator updates EMI and a valid application POSTs', async ({ page }) => {
  await page.goto(`${CLIENT}/finance`)
  await expect(page.getByRole('heading', { name: /Loan calculator/i })).toBeVisible()

  const emi = page.locator('#calc-emi')
  const before = await emi.textContent()
  await page.locator('#calc-price').fill('50000')
  await expect(emi).not.toHaveText(before ?? '')

  await page.getByRole('button', { name: /Use these numbers/i }).click()
  await page.locator('#app-name').fill('Alex Rivera')
  await page.locator('#app-email').fill('alex.shopper@autodrive.example')
  await page.locator('#app-phone').fill('2145550199')
  await page.locator('#app-job').selectOption('Employed')
  await page.locator('#app-income').fill('6500')
  await page.getByRole('button', { name: /Submit application/i }).click()
  await expect(page.getByText(/Application #\d+ received/i)).toBeVisible({ timeout: 20_000 })
})

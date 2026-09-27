import { expect, test } from '@playwright/test'
import { CLIENT } from './helpers.js'

test('client has a skip link, main landmark, and labelled search', async ({ page }) => {
  await page.goto(`${CLIENT}/vehicles`)
  await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#main-content')
  await expect(page.locator('main#main-content')).toBeVisible()
  await expect(page.locator('label[for="inventory-search"]')).toHaveText(/Search/i)
})

test('homepage vehicle images expose alt text', async ({ page }) => {
  await page.goto(CLIENT)
  const hero = page.getByRole('img', { name: /Toyota RAV4/i }).first()
  await expect(hero).toBeVisible({ timeout: 20_000 })
})

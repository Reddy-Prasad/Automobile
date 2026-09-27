import { expect } from '@playwright/test'

export const CLIENT = 'http://localhost:5173'
export const CMS = 'http://localhost:5181'
export const ADMIN = 'http://localhost:5182'

export async function waitForCards(page) {
  await expect(page.locator('.vehicle-card').first()).toBeVisible({ timeout: 20_000 })
}

export async function signInWithDemo(page, name) {
  await page.getByRole('button', { name: new RegExp(name, 'i') }).click()
  await expect(page.locator('input[type="email"]')).not.toHaveValue('')
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.waitForURL((url) => !String(url).includes('/login'), { timeout: 20_000 })
}

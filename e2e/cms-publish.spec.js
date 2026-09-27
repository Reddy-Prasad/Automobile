import { expect, test } from '@playwright/test'
import { CMS, signInWithDemo } from './helpers.js'

test('CMS admin can publish an approved page', async ({ page }) => {
  await page.goto(`${CMS}/cms/login`)
  await signInWithDemo(page, 'Jordan Hale')
  await expect(page.getByRole('heading', { name: /CMS dashboard/i })).toBeVisible({
    timeout: 20_000,
  })

  await page.goto(`${CMS}/cms/pages/summer-hours`)
  await expect(page.getByRole('heading', { name: /Pages/i })).toBeVisible({ timeout: 20_000 })

  const publish = page.getByRole('button', { name: 'Publish' })
  const unpublish = page.getByRole('button', { name: 'Unpublish' })
  await expect(publish.or(unpublish)).toBeVisible({ timeout: 20_000 })

  if (await publish.isVisible()) {
    await publish.click()
    await expect(page.getByText(/Published snapshot written/i)).toBeVisible({ timeout: 20_000 })
  }
})

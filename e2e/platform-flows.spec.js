import { expect, test } from '@playwright/test'
import { ADMIN, CLIENT, CMS, signInWithDemo, waitForCards } from './helpers.js'

test('FLOW 1 — Admin create + publish appears on the client lot', async ({ page }) => {
  await page.goto(`${ADMIN}/admin/login`)
  await signInWithDemo(page, 'Morgan Ellis')
  await page.goto(`${ADMIN}/admin/inventory/new`)
  await expect(page.getByRole('heading', { name: /Create vehicle/i })).toBeVisible({
    timeout: 20_000,
  })

  const stock = `P15${Date.now().toString().slice(-6)}`
  await page.locator('#stockNumber').fill(stock)
  await page.locator('#make').fill('Mazda')
  await page.locator('#model').fill('CX-5')
  await page.locator('#price').fill('31990')
  await page.getByRole('button', { name: /Save draft/i }).click()
  await expect(page.getByRole('heading', { name: /2026 Mazda CX-5/i })).toBeVisible({
    timeout: 20_000,
  })
  await page.getByRole('button', { name: /^Publish$/ }).click()
  await expect(page.getByText(/Published\. Refresh the client/i)).toBeVisible({ timeout: 20_000 })

  await page.goto(`${CLIENT}/vehicles`)
  await waitForCards(page)
  await page.locator('#inventory-search').fill('CX-5')
  await expect(page.getByRole('heading', { name: /2026 Mazda CX-5/i })).toBeVisible()
})

test('FLOW 2 — CMS homepage publish updates the client offers heading', async ({ page }) => {
  const headline = `Day 15 specials ${Date.now().toString().slice(-4)}`

  await page.goto(`${CMS}/cms/login`)
  await signInWithDemo(page, 'Jordan Hale')
  await page.goto(`${CMS}/cms/homepage`)
  await expect(page.getByRole('heading', { name: /Homepage/i })).toBeVisible({ timeout: 20_000 })

  const returnDraft = page.getByRole('button', { name: /Return to draft/i })
  if (await returnDraft.isVisible()) await returnDraft.click()
  const unpublish = page.getByRole('button', { name: 'Unpublish' })
  if (await unpublish.isVisible()) await unpublish.click()

  await expect(page.locator('#headline')).toBeEnabled({ timeout: 20_000 })
  await page.locator('#headline').fill(headline)
  await page.getByRole('button', { name: /Save draft/i }).click()
  await expect(page.getByText(/Draft saved/i)).toBeVisible()

  await page.getByRole('button', { name: /Submit for review/i }).click()
  await expect(page.getByText(/Status is now in_review/i)).toBeVisible()
  await page.getByRole('button', { name: 'Approve' }).click()
  await expect(page.getByText(/Status is now approved/i)).toBeVisible()
  await page.getByRole('button', { name: 'Publish' }).click()
  await expect(page.getByText(/Published snapshot written/i)).toBeVisible({ timeout: 20_000 })

  await page.goto(CLIENT)
  await expect(page.getByRole('heading', { name: headline })).toBeVisible({ timeout: 20_000 })
})

test('FLOW 3 — client test drive appears on the Admin board', async ({ page }) => {
  const marker = `DeskDrive ${Date.now().toString().slice(-4)}`
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const iso = tomorrow.toISOString().slice(0, 10)

  await page.goto(`${CLIENT}/test-drive`)
  await page.locator('#drive-vehicle').waitFor({ timeout: 20_000 })
  await page.locator('#drive-vehicle').selectOption({ index: 1 })
  await page.locator('#booking-date').fill(iso)
  await page.locator('#booking-time').selectOption({ index: 1 })
  await page.locator('#booking-location').selectOption({ index: 1 })
  await page.locator('#booking-name').fill(marker)
  await page.locator('#booking-phone').fill('2145550199')
  await page.getByRole('button', { name: /Submit test drive/i }).click()
  await expect(page.getByText(/Test drive requested/i)).toBeVisible({ timeout: 20_000 })

  await page.goto(`${ADMIN}/admin/login`)
  await signInWithDemo(page, 'Jordan Hale')
  await page.goto(`${ADMIN}/admin/test-drives`)
  await expect(page.getByRole('cell', { name: marker })).toBeVisible({ timeout: 20_000 })
})

test('FLOW 4 — client finance application appears on the Admin board', async ({ page }) => {
  const marker = `DeskLoan ${Date.now().toString().slice(-4)}`

  await page.goto(`${CLIENT}/finance`)
  await page.getByRole('button', { name: /Use these numbers/i }).click()
  await page.locator('#app-name').fill(marker)
  await page.locator('#app-email').fill('desk.loan@autodrive.example')
  await page.locator('#app-phone').fill('2145550199')
  await page.locator('#app-job').selectOption('Employed')
  await page.locator('#app-income').fill('6500')
  await page.getByRole('button', { name: /Submit application/i }).click()
  await expect(page.getByText(/Application #\d+ received/i)).toBeVisible({ timeout: 20_000 })

  await page.goto(`${ADMIN}/admin/login`)
  await signInWithDemo(page, 'Jordan Hale')
  await page.goto(`${ADMIN}/admin/finance`)
  await expect(page.getByRole('cell', { name: marker })).toBeVisible({ timeout: 20_000 })
})

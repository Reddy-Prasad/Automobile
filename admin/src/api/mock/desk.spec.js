import { describe, expect, test } from 'vitest'
import { db } from './db'
import { applyClientDesk } from './desk'

describe('applyClientDesk', () => {
  test('upserts a shopper booking without dropping seed rows', async () => {
    const before = db.testdrives.length
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          testdrives: [{ id: 99, customerName: 'Desk Drive', vehicleTitle: '2026 Toyota RAV4' }],
          finance: [],
          service: [],
          tradeins: [],
        }),
        { status: 200 },
      )

    await applyClientDesk()
    expect(db.testdrives.length).toBe(before + 1)
    expect(db.testdrives.find((row) => row.id === 99).customerName).toBe('Desk Drive')
  })
})

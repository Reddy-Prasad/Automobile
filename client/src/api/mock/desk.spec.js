import { describe, expect, test } from 'vitest'
import { db } from './db'
import { buildClientDesk } from './desk'

describe('client desk snapshot', () => {
  test('adds a vehicle title so Admin can show the car, not just an id', () => {
    const snapshot = buildClientDesk()
    const rav4 = snapshot.testdrives.find((row) => Number(row.vehicleId) === 1)
    expect(rav4.vehicleTitle).toMatch(/RAV4/)
    expect(snapshot.finance.length).toBe(db.financeApplications.length)
  })
})

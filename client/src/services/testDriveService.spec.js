import { describe, expect, test, vi } from 'vitest'
import { request } from '@/api/http'
import { createTestDrive } from './testDriveService'

vi.mock('@/api/http', () => ({
  request: vi.fn().mockResolvedValue({ id: 9 }),
}))

test('createTestDrive POSTs the booking body the mock or .NET API expects', () => {
  const body = {
    vehicleId: 1,
    customerName: 'Alex Rivera',
    day: '2026-10-03',
    time: '10:00 AM',
    locationId: 'dallas',
  }
  createTestDrive(body)
  expect(request).toHaveBeenCalledWith('/test-drives', { method: 'POST', body })
})

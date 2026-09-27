import { describe, expect, test, vi } from 'vitest'
import { request } from '@/api/http'
import { createVehicle, publishVehicle } from './vehicleService'

vi.mock('@/api/http', () => ({
  request: vi.fn().mockResolvedValue({ id: 26, make: 'Honda', listingStatus: 'draft' }),
}))

describe('admin vehicleService', () => {
  test('createVehicle POSTs the form body — the UI does not write the database', () => {
    const body = { stockNumber: 'T14001', make: 'Honda', model: 'Civic', price: 28990 }
    createVehicle(body)
    expect(request).toHaveBeenCalledWith('/vehicles', { method: 'POST', body })
  })

  test('publishVehicle is a POST on the vehicle path, not a Vue store write to the client', () => {
    publishVehicle(26)
    expect(request).toHaveBeenCalledWith('/vehicles/26/publish', { method: 'POST' })
  })
})

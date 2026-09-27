import { beforeEach, describe, expect, test, vi } from 'vitest'
import { request } from '@/api/http'
import { getVehicle, listVehicles, patchVehicle } from './vehicleService'

vi.mock('@/api/http', () => ({
  request: vi.fn(),
}))

describe('vehicleService', () => {
  beforeEach(() => {
    request.mockReset()
    request.mockResolvedValue([])
  })

  test('listVehicles puts filters on the query string, not the path', () => {
    listVehicles({ make: 'Honda', maxPrice: 40000 })
    expect(request).toHaveBeenCalledWith('/vehicles?make=Honda&maxPrice=40000')
  })

  test('getVehicle uses a path parameter', () => {
    getVehicle(1)
    expect(request).toHaveBeenCalledWith('/vehicles/1')
  })

  test('patchVehicle sends only the changed fields in the body', () => {
    patchVehicle(1, { saved: true })
    expect(request).toHaveBeenCalledWith('/vehicles/1', {
      method: 'PATCH',
      body: { saved: true },
    })
  })
})

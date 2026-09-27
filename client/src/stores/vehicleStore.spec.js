import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { ApiError } from '@/api/errors'
import { getVehicle, listVehicles } from '@/services/vehicleService'
import { useVehicleStore } from './vehicleStore'

vi.mock('@/services/vehicleService', () => ({
  listVehicles: vi.fn(),
  getVehicle: vi.fn(),
  patchVehicle: vi.fn(),
}))

vi.mock('@/api/http', () => ({
  failNextRequest: vi.fn(),
}))

describe('vehicleStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    listVehicles.mockReset()
    getVehicle.mockReset()
  })

  test('200 with an empty array is empty UI, not an error', async () => {
    listVehicles.mockResolvedValue([])
    const store = useVehicleStore()
    await store.loadVehicles()
    expect(store.listStatus).toBe('empty')
    expect(store.items).toEqual([])
  })

  test('200 with cars updates Pinia items so the grid can render', async () => {
    listVehicles.mockResolvedValue([{ id: 1, make: 'Toyota', model: 'RAV4' }])
    const store = useVehicleStore()
    await store.loadVehicles()
    expect(store.listStatus).toBe('success')
    expect(store.count).toBe(1)
    expect(store.byId(1).model).toBe('RAV4')
  })

  test('404 on details is empty, not a spinner that never stops', async () => {
    getVehicle.mockRejectedValue(new ApiError(404, 'Vehicle not found'))
    const store = useVehicleStore()
    await expect(store.loadVehicle(101)).rejects.toMatchObject({ status: 404 })
    expect(store.detailStatus).toBe('empty')
    expect(store.current).toBeNull()
  })

  test('wrong string id still calls GET /vehicles/:id through the service', async () => {
    getVehicle.mockRejectedValue(new ApiError(404, 'Vehicle not found'))
    const store = useVehicleStore()
    await expect(store.loadVehicle('undefined')).rejects.toBeTruthy()
    expect(getVehicle).toHaveBeenCalledWith('undefined')
  })
})

import { request } from '@/api/http'

export function listVehicles(params = {}) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value != null) search.set(key, String(value))
  })

  const query = search.toString()
  return request(`/vehicles${query ? `?${query}` : ''}`)
}

export function getVehicle(id) {
  return request(`/vehicles/${id}`)
}

export function patchVehicle(id, changes) {
  return request(`/vehicles/${id}`, { method: 'PATCH', body: changes })
}

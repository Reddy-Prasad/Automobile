import { request } from '@/api/http'

export function listVehicles() {
  return request('/vehicles')
}

export function getVehicle(id) {
  return request(`/vehicles/${id}`)
}

export function createVehicle(body) {
  return request('/vehicles', { method: 'POST', body })
}

export function updateVehicle(id, body) {
  return request(`/vehicles/${id}`, { method: 'PUT', body })
}

export function deleteVehicle(id) {
  return request(`/vehicles/${id}`, { method: 'DELETE' })
}

export function publishVehicle(id) {
  return request(`/vehicles/${id}/publish`, { method: 'POST' })
}

export function unpublishVehicle(id) {
  return request(`/vehicles/${id}/unpublish`, { method: 'POST' })
}

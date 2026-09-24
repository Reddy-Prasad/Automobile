import { request } from '@/api/http'

export function listTestDrives() {
  return request('/test-drives')
}

export function createTestDrive(payload) {
  return request('/test-drives', { method: 'POST', body: payload })
}

export function patchTestDrive(id, changes) {
  return request(`/test-drives/${id}`, { method: 'PATCH', body: changes })
}

export function deleteTestDrive(id) {
  return request(`/test-drives/${id}`, { method: 'DELETE' })
}

import { request } from '@/api/http'

export function getDashboard() {
  return request('/dashboard')
}

export function listBoard(type) {
  return request(`/${type}`)
}

export function patchBoardItem(type, id, body) {
  return request(`/${type}/${id}`, { method: 'PATCH', body })
}

export function listDealers() {
  return request('/dealers')
}

export function listUsers() {
  return request('/users')
}

export function patchUser(id, body) {
  return request(`/users/${id}`, { method: 'PATCH', body })
}

export function getSettings() {
  return request('/settings')
}

export function updateSettings(body) {
  return request('/settings', { method: 'PUT', body })
}

export function getReports() {
  return request('/reports')
}

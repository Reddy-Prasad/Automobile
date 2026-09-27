import { request } from '@/api/http'

export function getDashboard() {
  return request('/dashboard')
}

export function listContent(type) {
  return request(`/content/${type}`)
}

export function getContent(type, id) {
  return request(`/content/${type}/${id}`)
}

export function createContent(type, body) {
  return request(`/content/${type}`, { method: 'POST', body })
}

export function updateContent(type, id, body) {
  return request(`/content/${type}/${id}`, { method: 'PUT', body })
}

export function updateSingleton(type, body) {
  return request(`/content/${type}`, { method: 'PUT', body })
}

export function deleteContent(type, id) {
  return request(`/content/${type}/${id}`, { method: 'DELETE' })
}

export function transitionContent(type, id, action) {
  return request(`/content/${type}/${id}/transition`, {
    method: 'POST',
    body: { action },
  })
}

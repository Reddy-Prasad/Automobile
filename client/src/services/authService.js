import { request } from '@/api/http'

export function login(payload) {
  return request('/auth/login', { method: 'POST', body: payload })
}

export function register(payload) {
  return request('/auth/register', { method: 'POST', body: payload })
}

export function logout() {
  return request('/auth/logout', { method: 'POST' })
}

export function getCurrentUser() {
  return request('/auth/me')
}

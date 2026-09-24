import { request } from '@/api/http'

export function listCustomers() {
  return request('/customers')
}

export function getCustomer(id) {
  return request(`/customers/${id}`)
}

export function createCustomer(payload) {
  return request('/customers', { method: 'POST', body: payload })
}

export function replaceCustomer(id, payload) {
  return request(`/customers/${id}`, { method: 'PUT', body: payload })
}

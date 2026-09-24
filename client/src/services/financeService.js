import { request } from '@/api/http'

export function listFinanceApplications() {
  return request('/finance-applications')
}

export function createFinanceApplication(payload) {
  return request('/finance-applications', { method: 'POST', body: payload })
}

export function replaceFinanceApplication(id, payload) {
  return request(`/finance-applications/${id}`, { method: 'PUT', body: payload })
}

export function deleteFinanceApplication(id) {
  return request(`/finance-applications/${id}`, { method: 'DELETE' })
}

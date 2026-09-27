import { request } from '@/api/http'

export function listTradeIns() {
  return request('/trade-ins')
}

export function createTradeIn(payload) {
  return request('/trade-ins', { method: 'POST', body: payload })
}

export function deleteTradeIn(id) {
  return request(`/trade-ins/${id}`, { method: 'DELETE' })
}

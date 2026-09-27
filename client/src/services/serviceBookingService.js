import { request } from '@/api/http'

export function listServiceBookings() {
  return request('/service-bookings')
}

export function createServiceBooking(payload) {
  return request('/service-bookings', { method: 'POST', body: payload })
}

export function deleteServiceBooking(id) {
  return request(`/service-bookings/${id}`, { method: 'DELETE' })
}

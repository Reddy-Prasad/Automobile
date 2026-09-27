import { locations } from './dealer'

export const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

export const SERVICE_TYPES = [
  'Oil & filter change',
  'Tire rotation & balance',
  'Brake inspection',
  'Battery test & replace',
  'Multi-point inspection',
  'EV battery health check',
]

export const CONDITION_OPTIONS = ['Excellent', 'Good', 'Fair', 'Needs work']

export const STORE_OPTIONS = locations.map((location) => ({
  id: location.id,
  label: `${location.name} — ${location.city}`,
}))

const currentYear = new Date().getFullYear()

export const YEAR_OPTIONS = Array.from({ length: 25 }, (_, index) => currentYear - index)

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

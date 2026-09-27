import { CONDITION_OPTIONS } from '@/data/booking'

const multipliers = {
  Excellent: 1.12,
  Good: 1,
  Fair: 0.82,
  'Needs work': 0.58,
}

export function estimateTradeValue({ year, mileage, condition }) {
  const age = new Date().getFullYear() - Number(year || new Date().getFullYear())
  const miles = Math.max(Number(mileage) || 0, 0)
  const raw = 26000 - age * 1600 - miles * 0.07
  const adjusted = raw * (multipliers[condition] || 1)
  return Math.max(1200, Math.round(adjusted / 100) * 100)
}

export { CONDITION_OPTIONS }

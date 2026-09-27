import { vehicles as seedVehicles } from '@/data/vehicles'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export const db = {
  vehicles: clone(seedVehicles),
  customers: [],
  testDrives: [],
  financeApplications: [],
  serviceBookings: [],
  tradeIns: [],
}

const counters = {
  customer: 1,
  testDrive: 1,
  finance: 1,
  service: 1,
  tradeIn: 1,
}

export function nextId(collection) {
  const id = counters[collection]
  counters[collection] += 1
  return id
}

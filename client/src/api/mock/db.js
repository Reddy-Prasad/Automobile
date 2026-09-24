import { vehicles as seedVehicles } from '@/data/vehicles'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export const db = {
  vehicles: clone(seedVehicles),
  customers: [],
  testDrives: [],
  financeApplications: [],
}

const counters = {
  customer: 1,
  testDrive: 1,
  finance: 1,
}

export function nextId(collection) {
  const id = counters[collection]
  counters[collection] += 1
  return id
}

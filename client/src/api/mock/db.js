import { seedUsers } from '@/data/users'
import { vehicles as seedVehicles } from '@/data/vehicles'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export const db = {
  vehicles: clone(seedVehicles),
  users: clone(seedUsers),
  sessions: [],
  customers: [],
  testDrives: [],
  financeApplications: [],
  serviceBookings: [],
  tradeIns: [],
}

const counters = {
  user: seedUsers.length + 1,
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

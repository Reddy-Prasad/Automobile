import {
  seedFinanceApplications,
  seedServiceBookings,
  seedTestDrives,
  seedTradeIns,
} from '@/data/accountSeeds'
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
  testDrives: clone(seedTestDrives),
  financeApplications: clone(seedFinanceApplications),
  serviceBookings: clone(seedServiceBookings),
  tradeIns: clone(seedTradeIns),
}

const counters = {
  user: seedUsers.length + 1,
  customer: 1,
  testDrive: seedTestDrives.length + 1,
  finance: seedFinanceApplications.length + 1,
  service: seedServiceBookings.length + 1,
  tradeIn: seedTradeIns.length + 1,
}

export function nextId(collection) {
  const id = counters[collection]
  counters[collection] += 1
  return id
}

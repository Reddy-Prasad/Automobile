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

export async function applyPublishedInventory() {
  try {
    const response = await fetch('/admin-published.json', { cache: 'no-store' })
    if (!response.ok) return
    const snapshot = await response.json()
    for (const vehicle of snapshot.vehicles ?? []) {
      const index = db.vehicles.findIndex((item) => Number(item.id) === Number(vehicle.id))
      if (index >= 0) Object.assign(db.vehicles[index], vehicle)
      else db.vehicles.push(vehicle)
    }
    const unpublished = snapshot.unpublishedIds ?? []
    if (unpublished.length) {
      db.vehicles = db.vehicles.filter((item) => !unpublished.includes(item.id))
    }
  } catch {
    // Seed inventory stays if the snapshot is missing.
  }
}

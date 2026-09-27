import { db } from './db'

function vehicleTitle(record) {
  if (record.vehicleTitle) return record.vehicleTitle
  const vehicle = db.vehicles.find((item) => Number(item.id) === Number(record.vehicleId))
  if (!vehicle) return record.vehicleTitle || 'Shopper quote'
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
}

export function buildClientDesk() {
  return {
    publishedAt: new Date().toISOString(),
    testdrives: db.testDrives.map((row) => ({ ...row, vehicleTitle: vehicleTitle(row) })),
    finance: db.financeApplications.map((row) => ({
      ...row,
      vehicleTitle: row.vehicleTitle || 'Shopper quote',
    })),
    service: db.serviceBookings,
    tradeins: db.tradeIns,
  }
}

export function writeClientDesk() {
  fetch('/__publish-desk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildClientDesk(), null, 2),
  }).catch(() => {
    // Classroom bridge only works in `npm run dev`.
  })
}

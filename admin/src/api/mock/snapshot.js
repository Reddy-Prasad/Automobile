function publicVehicle(vehicle) {
  const { listingStatus, ...rest } = vehicle
  return rest
}

export function buildPublishedInventory(db) {
  return {
    publishedAt: new Date().toISOString(),
    vehicles: db.vehicles.filter((item) => item.listingStatus === 'published').map(publicVehicle),
    unpublishedIds: db.vehicles
      .filter((item) => item.listingStatus !== 'published' && item.id > 24)
      .map((item) => item.id),
  }
}

export function writePublishedInventory(db) {
  const snapshot = buildPublishedInventory(db)
  fetch('/__publish-inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(snapshot, null, 2),
  }).catch(() => {
    // Classroom bridge only works in `npm run dev`.
  })
  return snapshot
}

export function vehicleTitle(vehicle) {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
}

export function uniqueValues(vehicles, key) {
  return [...new Set(vehicles.map((vehicle) => vehicle[key]))].sort()
}

export function filterVehicles(vehicles, criteria) {
  return vehicles.filter((vehicle) => {
    if (criteria.condition === 'new' && vehicle.condition !== 'new') return false
    if (criteria.condition === 'used' && vehicle.condition === 'new') return false
    if (criteria.make && vehicle.make !== criteria.make) return false
    if (criteria.bodyType && vehicle.bodyType !== criteria.bodyType) return false
    if (criteria.maxPrice && vehicle.price > criteria.maxPrice) return false
    return true
  })
}

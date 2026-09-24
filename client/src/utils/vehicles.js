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

const inventoryComparers = {
  featured: (a, b) => Number(b.featured) - Number(a.featured),
  'price-low': (a, b) => a.price - b.price,
  'price-high': (a, b) => b.price - a.price,
  newest: (a, b) => b.year - a.year,
  mileage: (a, b) => a.mileage - b.mileage,
}

export function filterInventory(vehicles, filters) {
  const { search, make, fuelType, transmission, maxPrice, year, condition } = filters
  const searchTerm = search.trim().toLowerCase()

  return vehicles.filter((vehicle) => {
    const haystack = [
      vehicle.year,
      vehicle.make,
      vehicle.model,
      vehicle.trim,
      vehicle.bodyType,
      vehicle.stockNumber,
    ]
      .join(' ')
      .toLowerCase()

    return (
      (!searchTerm || haystack.includes(searchTerm)) &&
      (!make || vehicle.make === make) &&
      (!fuelType || vehicle.fuelType === fuelType) &&
      (!transmission || vehicle.transmission === transmission) &&
      (!maxPrice || vehicle.price <= Number(maxPrice)) &&
      (!year || vehicle.year === Number(year)) &&
      (!condition || vehicle.condition === condition)
    )
  })
}

export function sortInventory(vehicles, sortBy) {
  const compare = inventoryComparers[sortBy] ?? inventoryComparers.featured
  return [...vehicles].sort(compare)
}

export function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

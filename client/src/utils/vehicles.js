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

export function findVehicleById(list, id) {
  return list.find((vehicle) => String(vehicle.id) === String(id))
}

export function vehicleLocation(vehicle, locations) {
  return locations[(vehicle.id - 1) % locations.length]
}

export function vehicleFeatures(vehicle) {
  const features = []

  if (vehicle.condition === 'new') features.push('Full factory warranty')
  if (vehicle.condition === 'cpo') {
    features.push('Certified 172-point inspection')
    features.push('12-month / 12,000-mile limited warranty')
  }
  if (vehicle.fuelType === 'Electric') {
    features.push('Electric powertrain')
    features.push('Home charging compatible')
  }
  if (vehicle.fuelType === 'Hybrid') {
    features.push('Hybrid powertrain')
    features.push('Regenerative braking')
  }
  if (vehicle.drivetrain === 'AWD' || vehicle.drivetrain === '4WD') {
    features.push(`${vehicle.drivetrain} traction`)
  }
  if (vehicle.transmission === 'Manual') features.push('Manual gearbox')
  if (vehicle.transmission === 'CVT') features.push('CVT transmission')

  features.push('Backup camera', 'Bluetooth audio', 'Apple CarPlay / Android Auto')
  return features
}

export function vehicleGallery(vehicle) {
  const items = []

  if (vehicle.image) {
    items.push({ id: 'exterior', src: vehicle.image, label: 'Exterior' })
  }

  items.push({
    id: 'paint',
    src: null,
    color: vehicle.colorHex,
    label: vehicle.exteriorColor,
  })

  return items
}

export function relatedVehicles(list, vehicle, limit = 3) {
  return list
    .filter(
      (item) =>
        item.id !== vehicle.id &&
        (item.make === vehicle.make || item.bodyType === vehicle.bodyType),
    )
    .slice(0, limit)
}

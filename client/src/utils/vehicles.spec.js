import { describe, expect, test } from 'vitest'
import { filterInventory, filterVehicles, findVehicleById, paginate, sortInventory } from './vehicles'

const lot = [
  {
    id: 1,
    year: 2026,
    make: 'Toyota',
    model: 'RAV4',
    trim: 'XLE',
    bodyType: 'SUV',
    stockNumber: 'N26104',
    condition: 'new',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    price: 36990,
    mileage: 8,
    featured: true,
  },
  {
    id: 2,
    year: 2024,
    make: 'Ford',
    model: 'F-150',
    trim: 'XLT',
    bodyType: 'Truck',
    stockNumber: 'N26211',
    condition: 'used',
    fuelType: 'Gas',
    transmission: 'Automatic',
    price: 52995,
    mileage: 12000,
    featured: false,
  },
]

describe('vehicle search filters', () => {
  test('homepage search keeps Honda out when make is Toyota', () => {
    const matches = filterVehicles(lot, { condition: 'all', make: 'Toyota', bodyType: '', maxPrice: '' })
    expect(matches).toHaveLength(1)
    expect(matches[0].model).toBe('RAV4')
  })

  test('inventory search matches model text and ignores case', () => {
    const matches = filterInventory(lot, {
      search: 'rav4',
      make: '',
      fuelType: '',
      transmission: '',
      maxPrice: '',
      year: '',
      condition: '',
    })
    expect(matches.map((item) => item.id)).toEqual([1])
  })

  test('computed-style filter: max price 40000 drops the F-150', () => {
    const matches = filterInventory(lot, {
      search: '',
      make: '',
      fuelType: '',
      transmission: '',
      maxPrice: 40000,
      year: '',
      condition: '',
    })
    expect(matches).toHaveLength(1)
    expect(matches[0].make).toBe('Toyota')
  })

  test('sort price-low puts the RAV4 first', () => {
    const sorted = sortInventory(lot, 'price-low')
    expect(sorted[0].model).toBe('RAV4')
  })

  test('paginate page 2 of size 1 returns the truck', () => {
    expect(paginate(lot, 2, 1)[0].model).toBe('F-150')
  })

  test('findVehicleById accepts string or number — wrong route param is a miss', () => {
    expect(findVehicleById(lot, '1')?.model).toBe('RAV4')
    expect(findVehicleById(lot, 'undefined')).toBeUndefined()
  })
})

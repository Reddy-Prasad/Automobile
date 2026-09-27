import { describe, expect, test } from 'vitest'
import { validateVehicle } from './validate'

describe('admin vehicle form', () => {
  test('empty create form is a 422-style validation object, not a POST', () => {
    const errors = validateVehicle({
      stockNumber: '',
      make: '',
      model: '',
      year: '',
      price: '',
    })
    expect(errors.stockNumber).toMatch(/required/i)
    expect(errors.make).toMatch(/required/i)
    expect(errors.model).toMatch(/required/i)
    expect(errors.price).toMatch(/price/i)
  })

  test('a complete Civic draft passes validation', () => {
    const errors = validateVehicle({
      stockNumber: 'T14001',
      make: 'Honda',
      model: 'Civic',
      year: 2026,
      price: 28990,
    })
    expect(errors).toEqual({})
  })
})

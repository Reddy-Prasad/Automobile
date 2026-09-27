import { describe, expect, test } from 'vitest'
import { calculateLoan, validateFinanceApplication } from './finance'

describe('finance calculator', () => {
  test('EMI for 30000 at 6.9% over 60 months is a positive monthly payment', () => {
    const quote = calculateLoan({
      vehiclePrice: 35000,
      downPayment: 5000,
      apr: 6.9,
      termMonths: 60,
    })
    expect(quote.loanAmount).toBe(30000)
    expect(quote.monthlyEmi).toBeGreaterThan(500)
    expect(quote.monthlyEmi).toBeLessThan(700)
    expect(quote.totalPayment).toBeGreaterThan(quote.loanAmount)
  })

  test('zero APR splits the loan evenly', () => {
    const quote = calculateLoan({
      vehiclePrice: 12000,
      downPayment: 0,
      apr: 0,
      termMonths: 12,
    })
    expect(quote.monthlyEmi).toBe(1000)
    expect(quote.totalInterest).toBe(0)
  })

  test('validation rejects a missing name and a short phone', () => {
    const errors = validateFinanceApplication({
      name: '',
      email: 'not-an-email',
      phone: '555',
      employment: '',
      monthlyIncome: '',
      loanAmount: 0,
      termMonths: 12,
    })
    expect(errors.name).toMatch(/required/i)
    expect(errors.email).toMatch(/valid email/i)
    expect(errors.phone).toMatch(/10-digit/i)
    expect(errors.employment).toBeTruthy()
    expect(errors.loanAmount).toBeTruthy()
    expect(errors.termMonths).toBeTruthy()
  })
})

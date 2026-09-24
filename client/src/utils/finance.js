export const TERM_OPTIONS = [36, 48, 60, 72, 84]

export const EMPLOYMENT_OPTIONS = [
  'Employed',
  'Self-employed',
  'Retired',
  'Military',
  'Student',
  'Other',
]

/**
 * Standard reducing-balance EMI.
 * monthly = P * r / (1 - (1 + r) ** -n)  when r > 0
 */
export function calculateLoan({ vehiclePrice, downPayment, apr, termMonths }) {
  const price = Math.max(Number(vehiclePrice) || 0, 0)
  const down = Math.min(Math.max(Number(downPayment) || 0, 0), price)
  const loanAmount = roundCents(price - down)
  const months = Math.max(Number(termMonths) || 1, 1)
  const monthlyRate = Math.max(Number(apr) || 0, 0) / 100 / 12

  let monthlyEmi = 0
  if (loanAmount > 0) {
    monthlyEmi =
      monthlyRate === 0
        ? loanAmount / months
        : (loanAmount * monthlyRate) / (1 - (1 + monthlyRate) ** -months)
  }

  monthlyEmi = roundCents(monthlyEmi)
  const totalPayment = roundCents(monthlyEmi * months)
  const totalInterest = roundCents(Math.max(totalPayment - loanAmount, 0))

  return { loanAmount, monthlyEmi, totalInterest, totalPayment, months }
}

export function roundCents(value) {
  return Math.round((Number(value) || 0) * 100) / 100
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /[0-9]{10}/

export function validateFinanceApplication(form) {
  const errors = {}
  const name = String(form.name ?? '').trim()
  const email = String(form.email ?? '').trim()
  const phone = String(form.phone ?? '').trim()
  const employment = String(form.employment ?? '').trim()
  const income = Number(form.monthlyIncome)
  const loanAmount = Number(form.loanAmount)
  const termMonths = Number(form.termMonths)

  if (!name) errors.name = 'Name is required.'
  if (!email) errors.email = 'Email is required.'
  else if (!emailPattern.test(email)) errors.email = 'Enter a valid email address.'

  const digits = phone.replace(/\D/g, '')
  if (!phone) errors.phone = 'Phone is required.'
  else if (!phonePattern.test(digits)) errors.phone = 'Enter a 10-digit US phone number.'

  if (!employment) errors.employment = 'Select your employment status.'

  if (!form.monthlyIncome && form.monthlyIncome !== 0) {
    errors.monthlyIncome = 'Monthly income is required.'
  } else if (Number.isNaN(income) || income <= 0) {
    errors.monthlyIncome = 'Monthly income must be greater than 0.'
  }

  if (!form.loanAmount && form.loanAmount !== 0) {
    errors.loanAmount = 'Loan amount is required.'
  } else if (Number.isNaN(loanAmount) || loanAmount <= 0) {
    errors.loanAmount = 'Loan amount must be greater than 0.'
  }

  if (!TERM_OPTIONS.includes(termMonths)) {
    errors.termMonths = 'Choose a loan tenure.'
  }

  return errors
}

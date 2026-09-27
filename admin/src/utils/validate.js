export function required(value, label) {
  if (String(value ?? '').trim()) return ''
  return `${label} is required.`
}

export function validEmail(value) {
  if (!value) return 'Email is required.'
  return /\S+@\S+\.\S+/.test(value) ? '' : 'Enter a valid email.'
}

export function collectErrors(checks) {
  return Object.fromEntries(Object.entries(checks).filter(([, message]) => message))
}

export function validateLogin(form) {
  return collectErrors({
    email: validEmail(form.email),
    password: required(form.password, 'Password'),
  })
}

export function validateVehicle(form) {
  return collectErrors({
    stockNumber: required(form.stockNumber, 'Stock number'),
    make: required(form.make, 'Make'),
    model: required(form.model, 'Model'),
    year: Number(form.year) >= 1990 ? '' : 'Enter a valid year.',
    price: Number(form.price) > 0 ? '' : 'Enter a price.',
  })
}

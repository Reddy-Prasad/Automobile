const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /[0-9]{10}/

export function required(value, message) {
  if (value === '' || value == null) return message
  return ''
}

export function validEmail(value, message = 'Enter a valid email address.') {
  const email = String(value ?? '').trim()
  if (!email) return 'Email is required.'
  if (!emailPattern.test(email)) return message
  return ''
}

export function validPhone(value, message = 'Enter a 10-digit US phone number.') {
  const phone = String(value ?? '').trim()
  if (!phone) return 'Phone is required.'
  if (!phonePattern.test(phone.replace(/\D/g, ''))) return message
  return ''
}

export function validDate(value, message = 'Choose a date.') {
  if (!value) return message
  return ''
}

export function validNumber(value, message, min = 1) {
  if (value === '' || value == null) return message
  const amount = Number(value)
  if (Number.isNaN(amount) || amount < min) return message
  return ''
}

export function collectErrors(checks) {
  const errors = {}
  Object.entries(checks).forEach(([key, message]) => {
    if (message) errors[key] = message
  })
  return errors
}

export function validateAppointment(form) {
  return collectErrors({
    date: validDate(form.date),
    time: required(form.time, 'Choose a time.'),
    locationId: required(form.locationId, 'Choose a store.'),
    name: required(String(form.name ?? '').trim(), 'Name is required.'),
    phone: validPhone(form.phone),
  })
}

export function validateTestDrive(form) {
  return {
    ...collectErrors({
      vehicleId: required(form.vehicleId, 'Choose a vehicle.'),
    }),
    ...validateAppointment(form),
  }
}

export function validateServiceBooking(form) {
  return {
    ...collectErrors({
      year: required(form.year, 'Choose the vehicle year.'),
      make: required(String(form.make ?? '').trim(), 'Make is required.'),
      model: required(String(form.model ?? '').trim(), 'Model is required.'),
      serviceType: required(form.serviceType, 'Choose a service type.'),
    }),
    ...validateAppointment(form),
  }
}

export function validateTradeIn(form) {
  return collectErrors({
    make: required(String(form.make ?? '').trim(), 'Make is required.'),
    model: required(String(form.model ?? '').trim(), 'Model is required.'),
    year: required(form.year, 'Choose the year.'),
    mileage: validNumber(form.mileage, 'Mileage must be 0 or more.', 0),
    condition: required(form.condition, 'Choose a condition.'),
    expectedValue: validNumber(form.expectedValue, 'Expected value must be greater than 0.'),
    email: validEmail(form.email),
    name: required(String(form.name ?? '').trim(), 'Name is required.'),
  })
}

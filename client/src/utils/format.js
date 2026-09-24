const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-US')

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatCurrency(amount) {
  return currencyFormatter.format(amount)
}

export function formatMileage(miles) {
  return `${numberFormatter.format(miles)} mi`
}

export function formatDate(isoDate) {
  return dateFormatter.format(new Date(isoDate))
}

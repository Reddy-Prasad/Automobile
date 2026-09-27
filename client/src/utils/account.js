export function belongsToUser(item, user) {
  if (!user || !item) return false
  const name = String(user.name ?? '').toLowerCase()
  const email = String(user.email ?? '').toLowerCase()
  const haystack = [item.customerName, item.name, item.email]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  if (email && haystack.includes(email)) return true
  return Boolean(name) && haystack.includes(name)
}

export function pageCount(length, pageSize) {
  return Math.max(1, Math.ceil(length / pageSize))
}

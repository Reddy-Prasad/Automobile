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

export function validateContent(form, fields) {
  const checks = {}
  for (const field of fields) {
    if (field.type === 'textarea' || field.type === 'text' || field.type === 'date' || field.type === 'select') {
      checks[field.key] = required(form[field.key], field.label)
    }
  }
  return collectErrors(checks)
}

export function validateNavigation(form) {
  if (!form.links?.length) return { links: 'Add at least one link.' }
  const bad = form.links.find((link) => !String(link.label ?? '').trim())
  if (bad) return { links: 'Every link needs a label.' }
  return {}
}

import { filterInventory } from '@/utils/vehicles'
import { db, nextId } from './db'

function json(status, data) {
  return new Response(data == null ? null : JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function readBody(init) {
  if (!init.body) return {}
  return typeof init.body === 'string' ? JSON.parse(init.body) : init.body
}

function match(pathname, pattern) {
  const pathParts = pathname.split('/').filter(Boolean)
  const patternParts = pattern.split('/').filter(Boolean)
  if (pathParts.length !== patternParts.length) return null

  const params = {}
  for (let index = 0; index < patternParts.length; index += 1) {
    const part = patternParts[index]
    if (part.startsWith(':')) {
      params[part.slice(1)] = pathParts[index]
    } else if (part !== pathParts[index]) {
      return null
    }
  }
  return params
}

function findById(list, id) {
  return list.find((item) => String(item.id) === String(id))
}

export function handleMockRequest(path, init = {}) {
  const method = (init.method ?? 'GET').toUpperCase()
  const url = new URL(path, 'https://autodrive.local')
  const pathname = url.pathname
  const query = Object.fromEntries(url.searchParams.entries())
  const headers = init.headers ?? {}
  const failHeader = headers['X-Mock-Fail'] ?? headers['x-mock-fail']

  if (failHeader === '1' || query._fail === '1') {
    return json(500, { message: 'Mock API failed on purpose. Press Retry to try again.' })
  }

  const body = readBody(init)

  if (method === 'GET' && match(pathname, '/vehicles')) {
    return json(200, filterInventory(db.vehicles, {
      search: query.search ?? '',
      make: query.make ?? '',
      fuelType: query.fuelType ?? '',
      transmission: query.transmission ?? '',
      maxPrice: query.maxPrice ?? '',
      year: query.year ?? '',
      condition: query.condition ?? '',
    }))
  }

  const vehicleMatch = match(pathname, '/vehicles/:id')
  if (vehicleMatch && method === 'GET') {
    const vehicle = findById(db.vehicles, vehicleMatch.id)
    return vehicle ? json(200, vehicle) : json(404, { message: `Vehicle ${vehicleMatch.id} was not found.` })
  }
  if (vehicleMatch && method === 'PATCH') {
    const vehicle = findById(db.vehicles, vehicleMatch.id)
    if (!vehicle) return json(404, { message: `Vehicle ${vehicleMatch.id} was not found.` })
    Object.assign(vehicle, body)
    return json(200, vehicle)
  }

  if (method === 'GET' && match(pathname, '/customers')) {
    return json(200, db.customers)
  }
  if (method === 'POST' && match(pathname, '/customers')) {
    if (!body.name || !body.phone) {
      return json(400, { message: 'A customer needs a name and phone number.' })
    }
    const existing = db.customers.find((customer) => customer.phone === body.phone)
    if (existing) {
      Object.assign(existing, body)
      return json(200, existing)
    }
    const customer = { id: nextId('customer'), email: '', ...body }
    db.customers.push(customer)
    return json(201, customer)
  }

  const customerMatch = match(pathname, '/customers/:id')
  if (customerMatch && method === 'GET') {
    const customer = findById(db.customers, customerMatch.id)
    return customer ? json(200, customer) : json(404, { message: 'Customer not found.' })
  }
  if (customerMatch && method === 'PUT') {
    const customer = findById(db.customers, customerMatch.id)
    if (!customer) return json(404, { message: 'Customer not found.' })
    if (!body.name || !body.phone) {
      return json(400, { message: 'PUT replaces the customer. Name and phone are required.' })
    }
    Object.assign(customer, { id: customer.id, email: '', ...body })
    return json(200, customer)
  }

  if (method === 'GET' && match(pathname, '/test-drives')) {
    return json(200, db.testDrives)
  }
  if (method === 'POST' && match(pathname, '/test-drives')) {
    if (!body.vehicleId || !body.customerId || !body.day) {
      return json(400, { message: 'A test drive needs vehicleId, customerId and a day.' })
    }
    const record = {
      id: nextId('testDrive'),
      status: 'requested',
      createdAt: new Date().toISOString(),
      ...body,
    }
    db.testDrives.push(record)
    return json(201, record)
  }

  const driveMatch = match(pathname, '/test-drives/:id')
  if (driveMatch && method === 'PATCH') {
    const record = findById(db.testDrives, driveMatch.id)
    if (!record) return json(404, { message: 'Test drive not found.' })
    Object.assign(record, body)
    return json(200, record)
  }
  if (driveMatch && method === 'DELETE') {
    const index = db.testDrives.findIndex((item) => String(item.id) === String(driveMatch.id))
    if (index === -1) return json(404, { message: 'Test drive not found.' })
    db.testDrives.splice(index, 1)
    return new Response(null, { status: 204 })
  }

  if (method === 'GET' && match(pathname, '/finance-applications')) {
    return json(200, db.financeApplications)
  }
  if (method === 'POST' && match(pathname, '/finance-applications')) {
    if (!body.vehicleId || !body.name) {
      return json(400, { message: 'A finance application needs a vehicleId and name.' })
    }
    const record = {
      id: nextId('finance'),
      status: 'submitted',
      createdAt: new Date().toISOString(),
      downPayment: body.downPayment ?? 5000,
      termMonths: body.termMonths ?? 60,
      apr: body.apr ?? 6.9,
      ...body,
    }
    db.financeApplications.push(record)
    return json(201, record)
  }

  const financeMatch = match(pathname, '/finance-applications/:id')
  if (financeMatch && method === 'PUT') {
    const record = findById(db.financeApplications, financeMatch.id)
    if (!record) return json(404, { message: 'Finance application not found.' })
    Object.assign(record, { id: record.id, createdAt: record.createdAt, ...body })
    return json(200, record)
  }
  if (financeMatch && method === 'DELETE') {
    const index = db.financeApplications.findIndex(
      (item) => String(item.id) === String(financeMatch.id),
    )
    if (index === -1) return json(404, { message: 'Finance application not found.' })
    db.financeApplications.splice(index, 1)
    return new Response(null, { status: 204 })
  }

  return json(404, { message: `No mock route for ${method} ${pathname}` })
}

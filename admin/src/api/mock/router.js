import { ADMIN_ROLES, hasPermission, PERMISSIONS } from '@/data/roles'
import { BOARD_KEYS, db, nextId } from './db'
import { writePublishedInventory } from './snapshot'

function json(status, data) {
  return new Response(data == null ? null : JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function parseBody(init) {
  if (!init.body) return {}
  try {
    return JSON.parse(init.body)
  } catch {
    return {}
  }
}

function bearerToken(init) {
  const header = init.headers?.Authorization || init.headers?.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7) : ''
}

function findSessionUser(token) {
  if (!token) return null
  const session = db.sessions.find((item) => item.token === token)
  if (session) return db.users.find((user) => user.id === session.userId) ?? null

  const parts = String(token).split('.')
  if (parts[0] !== 'mock') return null
  const user = db.users.find((item) => String(item.id) === String(parts[1]))
  if (user) db.sessions.push({ token, userId: user.id })
  return user ?? null
}

function publicUser(user) {
  const { password, ...safe } = user
  return safe
}

function requireUser(init) {
  const user = findSessionUser(bearerToken(init))
  if (!user) return { error: json(401, { message: 'Sign in required.' }) }
  return { user }
}

function requirePerm(user, permission) {
  if (hasPermission(user.role, permission)) return null
  return json(403, { message: 'You do not have permission for this action.' })
}

function dashboardPayload() {
  return {
    vehicles: {
      total: db.vehicles.length,
      draft: db.vehicles.filter((item) => item.listingStatus === 'draft').length,
      published: db.vehicles.filter((item) => item.listingStatus === 'published').length,
    },
    leads: db.leads.length,
    testdrives: db.testdrives.length,
    service: db.service.length,
    finance: db.finance.length,
    tradeins: db.tradeins.length,
    customers: db.customers.length,
  }
}

function handleAuth(path, init) {
  const method = init.method ?? 'GET'
  const body = parseBody(init)

  if (path === '/auth/login' && method === 'POST') {
    const user = db.users.find((item) => item.email === body.email)
    if (!user || user.password !== body.password) {
      return json(401, { message: 'Email or password is wrong.' })
    }
    if (!ADMIN_ROLES.includes(user.role)) {
      return json(403, { message: 'This app is for dealer operations staff.' })
    }
    const token = `mock.${user.id}.${Date.now()}`
    db.sessions.push({ token, userId: user.id })
    return json(200, { token, user: publicUser(user) })
  }

  if (path === '/auth/logout' && method === 'POST') {
    const token = bearerToken(init)
    db.sessions = db.sessions.filter((item) => item.token !== token)
    return json(204, null)
  }

  if (path === '/auth/me' && method === 'GET') {
    const { user, error } = requireUser(init)
    if (error) return error
    return json(200, publicUser(user))
  }

  return null
}

function handleVehicles(path, init, user) {
  const method = init.method ?? 'GET'
  const parts = path.replace(/^\//, '').split('/')
  if (parts[0] !== 'vehicles') return null

  if (!parts[1] && method === 'GET') {
    return json(200, db.vehicles)
  }

  if (!parts[1] && method === 'POST') {
    const denied = requirePerm(user, PERMISSIONS.INVENTORY_WRITE)
    if (denied) return denied
    const body = parseBody(init)
    const vehicle = {
      id: nextId('vehicle'),
      listingStatus: 'draft',
      featured: false,
      availability: 'AVAILABLE',
      condition: 'new',
      transmission: 'Automatic',
      ...body,
    }
    db.vehicles.push(vehicle)
    return json(201, vehicle)
  }

  const id = Number(parts[1])
  const vehicle = db.vehicles.find((item) => item.id === id)
  if (!vehicle) return json(404, { message: `Vehicle ${id} was not found.` })

  if (parts[2] === 'publish' && method === 'POST') {
    const denied = requirePerm(user, PERMISSIONS.INVENTORY_WRITE)
    if (denied) return denied
    vehicle.listingStatus = 'published'
    const snapshot = writePublishedInventory(db)
    return json(200, { vehicle, snapshot })
  }

  if (parts[2] === 'unpublish' && method === 'POST') {
    const denied = requirePerm(user, PERMISSIONS.INVENTORY_WRITE)
    if (denied) return denied
    vehicle.listingStatus = 'draft'
    const snapshot = writePublishedInventory(db)
    return json(200, { vehicle, snapshot })
  }

  if (method === 'GET') return json(200, vehicle)

  if (method === 'PUT') {
    const denied = requirePerm(user, PERMISSIONS.INVENTORY_WRITE)
    if (denied) return denied
    const skip = new Set(['id', 'listingStatus'])
    for (const [key, value] of Object.entries(parseBody(init))) {
      if (!skip.has(key)) vehicle[key] = value
    }
    if (vehicle.listingStatus === 'published') writePublishedInventory(db)
    return json(200, vehicle)
  }

  if (method === 'DELETE') {
    const denied = requirePerm(user, PERMISSIONS.INVENTORY_WRITE)
    if (denied) return denied
    if (vehicle.listingStatus === 'published') {
      return json(409, { message: 'Unpublish this vehicle before deleting it.' })
    }
    db.vehicles = db.vehicles.filter((item) => item.id !== vehicle.id)
    return json(204, null)
  }

  return json(405, { message: 'Unsupported vehicle method.' })
}

export function handleMockRequest(path, init) {
  if (init.headers?.['X-Mock-Fail'] === '1') {
    return json(500, { message: 'Simulated Admin API error.' })
  }

  const authResponse = handleAuth(path, init)
  if (authResponse) return authResponse

  const { user, error } = requireUser(init)
  if (error) return error

  const readDenied = requirePerm(user, PERMISSIONS.ADMIN_READ)
  if (readDenied) return readDenied

  const method = init.method ?? 'GET'
  const pathname = path.split('?')[0]

  if (pathname === '/dashboard' && method === 'GET') {
    return json(200, dashboardPayload())
  }

  const vehicleResponse = handleVehicles(pathname, init, user)
  if (vehicleResponse) return vehicleResponse

  if (pathname === '/settings') {
    if (method === 'GET') return json(200, db.settings)
    if (method === 'PUT') {
      const denied = requirePerm(user, PERMISSIONS.SETTINGS_WRITE)
      if (denied) return denied
      Object.assign(db.settings, parseBody(init))
      return json(200, db.settings)
    }
  }

  if (pathname === '/users' && method === 'GET') {
    const denied = requirePerm(user, PERMISSIONS.USERS_MANAGE)
    if (denied) return denied
    return json(200, db.users.map(publicUser))
  }

  const userMatch = pathname.match(/^\/users\/(\d+)$/)
  if (userMatch && method === 'PATCH') {
    const denied = requirePerm(user, PERMISSIONS.USERS_MANAGE)
    if (denied) return denied
    const target = db.users.find((item) => item.id === Number(userMatch[1]))
    if (!target) return json(404, { message: 'User not found.' })
    const body = parseBody(init)
    if (body.role) target.role = body.role
    return json(200, publicUser(target))
  }

  if (pathname === '/dealers' && method === 'GET') {
    return json(200, db.dealers)
  }

  const board = BOARD_KEYS.find((key) => pathname === `/${key}` || pathname.startsWith(`/${key}/`))
  if (board) {
    const list = db[board]
    if (pathname === `/${board}` && method === 'GET') return json(200, list)

    const idMatch = pathname.match(new RegExp(`^/${board}/(\\d+)$`))
    if (idMatch && method === 'PATCH') {
      const writeMap = {
        leads: PERMISSIONS.LEADS_WRITE,
        testdrives: PERMISSIONS.INVENTORY_WRITE,
        service: PERMISSIONS.SERVICE_WRITE,
        finance: PERMISSIONS.ADMIN_READ,
        tradeins: PERMISSIONS.INVENTORY_WRITE,
        customers: PERMISSIONS.ADMIN_READ,
      }
      const denied = requirePerm(user, writeMap[board] ?? PERMISSIONS.ADMIN_READ)
      if (denied) return denied
      const item = list.find((entry) => Number(entry.id) === Number(idMatch[1]))
      if (!item) return json(404, { message: 'Record not found.' })
      Object.assign(item, parseBody(init))
      return json(200, item)
    }
  }

  if (pathname === '/reports' && method === 'GET') {
    const denied = requirePerm(user, PERMISSIONS.REPORTS_READ)
    if (denied) return denied
    const byMake = {}
    for (const vehicle of db.vehicles) {
      byMake[vehicle.make] = (byMake[vehicle.make] ?? 0) + 1
    }
    return json(200, {
      inventory: dashboardPayload().vehicles,
      byMake,
      pipeline: {
        leads: db.leads.length,
        testdrives: db.testdrives.length,
        finance: db.finance.length,
        service: db.service.length,
      },
    })
  }

  return json(404, { message: `Unknown admin route: ${pathname}` })
}

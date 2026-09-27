import { CMS_ROLES, hasPermission, PERMISSIONS } from '@/data/roles'
import { ACTION_LABELS, STATUS, TRANSITIONS } from '@/data/workflow'
import { COLLECTIONS, db, nextId, SINGLETONS } from './db'
import { writePublishedSnapshot } from './snapshot'

function json(status, data) {
  return new Response(JSON.stringify(data), {
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
  if (session) {
    return db.users.find((user) => user.id === session.userId) ?? null
  }

  const parts = String(token).split('.')
  if (parts[0] !== 'mock') return null
  const user = db.users.find((item) => String(item.id) === String(parts[1]))
  if (user) db.sessions.push({ token, userId: user.id })
  return user ?? null
}

function publicUser(user) {
  const { password, ...safe } = user
  return {
    ...safe,
    permissions: undefined,
  }
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

function collectionOf(type) {
  return db[type]
}

function findItem(type, id) {
  if (SINGLETONS.includes(type)) {
    return db[type]?.id === id || id === type ? db[type] : null
  }
  return collectionOf(type)?.find((item) => String(item.id) === String(id)) ?? null
}

function nowIso() {
  return new Date().toISOString()
}

function touch(item, user, action, from, to) {
  item.updatedAt = nowIso()
  item.updatedBy = user.name
  item.history = [
    ...(item.history ?? []),
    { at: item.updatedAt, by: user.name, action, from, to },
  ]
}

function contentFields(body, existing = {}) {
  const skip = new Set(['id', 'status', 'updatedAt', 'updatedBy', 'history'])
  const next = { ...existing }
  for (const [key, value] of Object.entries(body)) {
    if (!skip.has(key)) next[key] = value
  }
  return next
}

function dashboardPayload() {
  const lists = [
    db.homepage,
    db.seo,
    db.footer,
    db.navigation,
    ...db.pages,
    ...db.banners,
    ...db.offers,
    ...db.media,
  ]

  const counts = {
    draft: 0,
    in_review: 0,
    approved: 0,
    published: 0,
  }
  for (const item of lists) {
    if (counts[item.status] != null) counts[item.status] += 1
  }

  const recent = [...lists]
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .slice(0, 8)
    .map((item) => ({
      id: item.id,
      title: item.headline || item.title || item.filename || item.label || item.blurb || item.id,
      status: item.status,
      updatedAt: item.updatedAt,
      updatedBy: item.updatedBy,
    }))

  return {
    counts,
    recent,
    workflow: ['draft', 'in_review', 'approved', 'published'],
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
    if (!CMS_ROLES.includes(user.role)) {
      return json(403, { message: 'This app is for CMS staff. Customers use the client site.' })
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

function handleWorkflow(type, id, init, user) {
  const item = findItem(type, id)
  if (!item) return json(404, { message: 'Content not found.' })

  const body = parseBody(init)
  const action = body.action
  const rule = TRANSITIONS[action]
  if (!rule) return json(400, { message: 'Unknown workflow action.' })

  const denied = requirePerm(user, rule.permission)
  if (denied) return denied

  if (item.status !== rule.from) {
    return json(409, {
      message: `Cannot ${ACTION_LABELS[action] ?? action} while this item is ${item.status}.`,
    })
  }

  const from = item.status
  item.status = rule.to
  touch(item, user, action, from, rule.to)

  let snapshot = null
  if (action === 'publish' || action === 'unpublish') {
    snapshot = writePublishedSnapshot(db)
  }

  return json(200, { item, snapshot })
}

export function handleMockRequest(path, init) {
  if (init.headers?.['X-Mock-Fail'] === '1') {
    return json(500, { message: 'Simulated CMS API error.' })
  }

  const authResponse = handleAuth(path, init)
  if (authResponse) return authResponse

  const { user, error } = requireUser(init)
  if (error) return error

  const readDenied = requirePerm(user, PERMISSIONS.CMS_READ)
  if (readDenied) return readDenied

  const method = init.method ?? 'GET'
  const parts = path.replace(/^\//, '').split('/')

  if (path === '/dashboard' && method === 'GET') {
    return json(200, dashboardPayload())
  }

  if (parts[0] !== 'content' || !parts[1]) {
    return json(404, { message: 'Unknown CMS route.' })
  }

  const type = parts[1]
  if (![...COLLECTIONS, ...SINGLETONS].includes(type)) {
    return json(404, { message: `Unknown content type: ${type}` })
  }

  if (parts[3] === 'transition' && method === 'POST') {
    return handleWorkflow(type, parts[2], init, user)
  }

  if (SINGLETONS.includes(type)) {
    if (method === 'GET') return json(200, db[type])
    if (method === 'PUT') {
      const denied = requirePerm(user, PERMISSIONS.CMS_DRAFT)
      if (denied) return denied
      if (db[type].status !== STATUS.DRAFT) {
        return json(409, { message: 'Unpublish or return this item to draft before editing.' })
      }
      Object.assign(db[type], contentFields(parseBody(init), db[type]))
      touch(db[type], user, 'save', STATUS.DRAFT, STATUS.DRAFT)
      return json(200, db[type])
    }
    return json(405, { message: 'Use GET or PUT on singleton content.' })
  }

  const list = collectionOf(type)

  if (!parts[2] && method === 'GET') {
    return json(200, list)
  }

  if (!parts[2] && method === 'POST') {
    const denied = requirePerm(user, PERMISSIONS.CMS_DRAFT)
    if (denied) return denied
    const item = {
      id: nextId(type),
      ...contentFields(parseBody(init)),
      status: STATUS.DRAFT,
      updatedAt: nowIso(),
      updatedBy: user.name,
      history: [{ at: nowIso(), by: user.name, action: 'create', from: '', to: STATUS.DRAFT }],
    }
    list.push(item)
    return json(201, item)
  }

  const item = findItem(type, parts[2])
  if (!item) return json(404, { message: 'Content not found.' })

  if (method === 'GET') return json(200, item)

  if (method === 'PUT') {
    const denied = requirePerm(user, PERMISSIONS.CMS_DRAFT)
    if (denied) return denied
    if (item.status !== STATUS.DRAFT) {
      return json(409, { message: 'Only draft items can be edited. Return this to draft first.' })
    }
    Object.assign(item, contentFields(parseBody(init), item))
    touch(item, user, 'save', STATUS.DRAFT, STATUS.DRAFT)
    return json(200, item)
  }

  if (method === 'DELETE') {
    const denied = requirePerm(user, PERMISSIONS.CMS_DRAFT)
    if (denied) return denied
    if (item.status === STATUS.PUBLISHED) {
      return json(409, { message: 'Unpublish this item before deleting it.' })
    }
    const index = list.findIndex((entry) => entry.id === item.id)
    list.splice(index, 1)
    return json(204, null)
  }

  return json(405, { message: 'Unsupported method.' })
}

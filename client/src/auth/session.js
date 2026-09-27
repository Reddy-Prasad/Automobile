const STORAGE_KEY = 'autodrive.session'

export function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { token: null, user: null }
  } catch {
    return { token: null, user: null }
  }
}

export function getStoredToken() {
  return readSession().token
}

export function writeSession({ token, user }) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }))
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}

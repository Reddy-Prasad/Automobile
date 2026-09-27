import { db } from './db'

function upsert(list, incoming) {
  if (!Array.isArray(incoming) || !incoming.length) return list
  const next = [...list]
  for (const row of incoming) {
    const index = next.findIndex((item) => String(item.id) === String(row.id))
    if (index >= 0) next[index] = { ...next[index], ...row }
    else next.push(row)
  }
  return next
}

export async function applyClientDesk() {
  try {
    const response = await fetch('/client-desk.json', { cache: 'no-store' })
    if (!response.ok) return
    const snapshot = await response.json()
    db.testdrives = upsert(db.testdrives, snapshot.testdrives)
    db.finance = upsert(db.finance, snapshot.finance)
    db.service = upsert(db.service, snapshot.service)
    db.tradeins = upsert(db.tradeins, snapshot.tradeins)
  } catch {
    // Seed boards stay if the snapshot is missing.
  }
}

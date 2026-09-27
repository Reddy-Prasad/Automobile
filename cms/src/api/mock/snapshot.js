import { STATUS } from '@/data/workflow'

function publicItem(item) {
  const { status, updatedAt, updatedBy, history, ...rest } = item
  return rest
}

export function buildPublishedSnapshot(db) {
  return {
    publishedAt: new Date().toISOString(),
    homepage: db.homepage.status === STATUS.PUBLISHED ? publicItem(db.homepage) : null,
    seo: db.seo.status === STATUS.PUBLISHED ? publicItem(db.seo) : null,
    footer: db.footer.status === STATUS.PUBLISHED ? publicItem(db.footer) : null,
    navigation: db.navigation.status === STATUS.PUBLISHED ? db.navigation.links : null,
    offers: db.offers.filter((item) => item.status === STATUS.PUBLISHED).map(publicItem),
    banners: db.banners.filter((item) => item.status === STATUS.PUBLISHED).map(publicItem),
    pages: db.pages.filter((item) => item.status === STATUS.PUBLISHED).map(publicItem),
    media: db.media.filter((item) => item.status === STATUS.PUBLISHED).map(publicItem),
  }
}

export function writePublishedSnapshot(db) {
  const snapshot = buildPublishedSnapshot(db)
  fetch('/__publish-snapshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(snapshot, null, 2),
  }).catch(() => {
    // Preview still works inside CMS if the Vite bridge is not running.
  })
  return snapshot
}

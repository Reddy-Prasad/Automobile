import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const adminRoot = fileURLToPath(new URL('.', import.meta.url))
const repoRoot = path.resolve(adminRoot, '..')
const snapshotPath = path.resolve(adminRoot, '../client/public/admin-published.json')

function publishInventoryPlugin() {
  return {
    name: 'publish-inventory',
    configureServer(server) {
      server.middlewares.use('/__publish-inventory', (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        const chunks = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf8')
            JSON.parse(raw)
            fs.mkdirSync(path.dirname(snapshotPath), { recursive: true })
            fs.writeFileSync(snapshotPath, raw.endsWith('\n') ? raw : `${raw}\n`)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, path: 'client/public/admin-published.json' }))
          } catch (error) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: error.message }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [vue(), publishInventoryPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5182,
    fs: {
      allow: [repoRoot],
    },
  },
})

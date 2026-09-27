import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const clientRoot = fileURLToPath(new URL('.', import.meta.url))
const deskPath = path.resolve(clientRoot, '../admin/public/client-desk.json')

function publishDeskPlugin() {
  return {
    name: 'publish-desk',
    configureServer(server) {
      server.middlewares.use('/__publish-desk', (req, res, next) => {
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
            fs.mkdirSync(path.dirname(deskPath), { recursive: true })
            fs.writeFileSync(deskPath, raw.endsWith('\n') ? raw : `${raw}\n`)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true, path: 'admin/public/client-desk.json' }))
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
  plugins: [vue(), publishDeskPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
})

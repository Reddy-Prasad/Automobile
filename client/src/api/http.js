import { ApiError } from './errors'
import { failNextRequest, mockConfig, randomDelay, wait } from './mock/config'
import { handleMockRequest } from './mock/router'
import { recordRequest } from './requestLog'

const useMock = import.meta.env.VITE_USE_MOCK !== 'false'
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

async function parseResponse(response) {
  if (response.status === 204) return null

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(response.status, payload.message || response.statusText, payload)
  }

  return payload
}

function buildInit(options) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  if (options.fail || mockConfig.failNext) {
    headers['X-Mock-Fail'] = '1'
    mockConfig.failNext = false
  }

  return {
    method: options.method ?? 'GET',
    headers,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  }
}

export async function request(path, options = {}) {
  const init = buildInit(options)
  const started = performance.now()

  try {
    let response

    if (useMock) {
      await wait(randomDelay())
      response = handleMockRequest(path, init)
    } else {
      response = await fetch(`${baseUrl}${path}`, init)
    }

    const data = await parseResponse(response)

    const entry = {
      id: started,
      method: init.method,
      path,
      status: response.status,
      ok: true,
      ms: Math.round(performance.now() - started),
    }
    recordRequest(entry)
    console.info(`[API] ${entry.method} ${entry.path} → ${entry.status} (${entry.ms}ms)`)

    return data
  } catch (error) {
    recordRequest({
      id: started,
      method: init.method,
      path,
      status: error.status ?? 0,
      ok: false,
      ms: Math.round(performance.now() - started),
      message: error.message,
    })
    throw error
  }
}

export { failNextRequest }
export { ApiError } from './errors'

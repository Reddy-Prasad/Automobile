export const mockConfig = {
  minDelayMs: 350,
  maxDelayMs: 700,
  failNext: false,
}

export function failNextRequest() {
  mockConfig.failNext = true
}

export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function randomDelay() {
  if (import.meta.env.VITE_MOCK_INSTANT === 'true') return 0
  const { minDelayMs, maxDelayMs } = mockConfig
  return Math.round(minDelayMs + Math.random() * (maxDelayMs - minDelayMs))
}

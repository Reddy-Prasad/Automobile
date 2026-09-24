export const mockConfig = {
  minDelayMs: 450,
  maxDelayMs: 900,
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
  const { minDelayMs, maxDelayMs } = mockConfig
  return Math.round(minDelayMs + Math.random() * (maxDelayMs - minDelayMs))
}

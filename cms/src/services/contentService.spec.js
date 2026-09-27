import { describe, expect, test, vi } from 'vitest'
import { request } from '@/api/http'
import { transitionContent } from './contentService'

vi.mock('@/api/http', () => ({
  request: vi.fn().mockResolvedValue({ id: 'summer-hours', status: 'published' }),
}))

test('CMS publish is POST /content/:type/:id/transition with action publish', () => {
  transitionContent('pages', 'summer-hours', 'publish')
  expect(request).toHaveBeenCalledWith('/content/pages/summer-hours/transition', {
    method: 'POST',
    body: { action: 'publish' },
  })
})

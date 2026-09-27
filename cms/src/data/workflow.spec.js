import { describe, expect, test } from 'vitest'
import { PERMISSIONS } from './roles'
import { STATUS, TRANSITIONS } from './workflow'

describe('CMS publish workflow', () => {
  test('publish is only legal from approved, and only with cms.publish', () => {
    expect(TRANSITIONS.publish.from).toBe(STATUS.APPROVED)
    expect(TRANSITIONS.publish.to).toBe(STATUS.PUBLISHED)
    expect(TRANSITIONS.publish.permission).toBe(PERMISSIONS.CMS_PUBLISH)
  })

  test('an editor can submit a draft but cannot publish', () => {
    expect(TRANSITIONS.submit.from).toBe(STATUS.DRAFT)
    expect(TRANSITIONS.submit.permission).toBe(PERMISSIONS.CMS_DRAFT)
    expect(TRANSITIONS.publish.permission).not.toBe(PERMISSIONS.CMS_DRAFT)
  })
})

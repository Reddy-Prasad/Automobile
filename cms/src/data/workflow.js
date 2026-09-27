import { PERMISSIONS } from './roles'

export const STATUS = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  PUBLISHED: 'published',
}

export const STATUS_LABELS = {
  [STATUS.DRAFT]: 'Draft',
  [STATUS.IN_REVIEW]: 'In review',
  [STATUS.APPROVED]: 'Approved',
  [STATUS.PUBLISHED]: 'Published',
}

export const STATUS_BADGE = {
  [STATUS.DRAFT]: 'text-bg-secondary',
  [STATUS.IN_REVIEW]: 'text-bg-warning',
  [STATUS.APPROVED]: 'text-bg-info',
  [STATUS.PUBLISHED]: 'text-bg-success',
}

export const TRANSITIONS = {
  submit: { from: STATUS.DRAFT, to: STATUS.IN_REVIEW, permission: PERMISSIONS.CMS_DRAFT },
  approve: { from: STATUS.IN_REVIEW, to: STATUS.APPROVED, permission: PERMISSIONS.CMS_REVIEW },
  reject: { from: STATUS.IN_REVIEW, to: STATUS.DRAFT, permission: PERMISSIONS.CMS_REVIEW },
  publish: { from: STATUS.APPROVED, to: STATUS.PUBLISHED, permission: PERMISSIONS.CMS_PUBLISH },
  unpublish: { from: STATUS.PUBLISHED, to: STATUS.DRAFT, permission: PERMISSIONS.CMS_PUBLISH },
}

export const ACTION_LABELS = {
  submit: 'Submit for review',
  approve: 'Approve',
  reject: 'Return to draft',
  publish: 'Publish',
  unpublish: 'Unpublish',
}

export function statusLabel(status) {
  return STATUS_LABELS[status] ?? status
}

export function statusBadge(status) {
  return STATUS_BADGE[status] ?? 'text-bg-light'
}

export function canEditFields(status, canDraft) {
  return Boolean(canDraft && status === STATUS.DRAFT)
}

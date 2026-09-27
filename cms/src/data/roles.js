export const ROLES = {
  CMS_EDITOR: 'CMS_EDITOR',
  CMS_REVIEWER: 'CMS_REVIEWER',
  ADMIN: 'ADMIN',
}

export const PERMISSIONS = {
  CMS_READ: 'cms.read',
  CMS_DRAFT: 'cms.draft',
  CMS_REVIEW: 'cms.review',
  CMS_PUBLISH: 'cms.publish',
}

export const ROLE_PERMISSIONS = {
  [ROLES.CMS_EDITOR]: [PERMISSIONS.CMS_READ, PERMISSIONS.CMS_DRAFT],
  [ROLES.CMS_REVIEWER]: [PERMISSIONS.CMS_READ, PERMISSIONS.CMS_REVIEW],
  [ROLES.ADMIN]: ['*'],
}

export const CMS_ROLES = [ROLES.CMS_EDITOR, ROLES.CMS_REVIEWER, ROLES.ADMIN]

export const ROLE_LABELS = {
  [ROLES.CMS_EDITOR]: 'Editor',
  [ROLES.CMS_REVIEWER]: 'Reviewer',
  [ROLES.ADMIN]: 'Admin',
}

export function permissionsFor(role) {
  return ROLE_PERMISSIONS[role] ?? []
}

export function hasPermission(role, permission) {
  const list = permissionsFor(role)
  return list.includes('*') || list.includes(permission)
}

export function roleLabel(role) {
  return ROLE_LABELS[role] ?? role
}

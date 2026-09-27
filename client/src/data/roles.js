export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  CMS_EDITOR: 'CMS_EDITOR',
  CMS_REVIEWER: 'CMS_REVIEWER',
  ADMIN: 'ADMIN',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  SERVICE_MANAGER: 'SERVICE_MANAGER',
}

export const PERMISSIONS = {
  ACCOUNT_READ: 'account.read',
  CMS_READ: 'cms.read',
  CMS_DRAFT: 'cms.draft',
  CMS_PUBLISH: 'cms.publish',
  ADMIN_READ: 'admin.read',
  INVENTORY_WRITE: 'inventory.write',
  SERVICE_WRITE: 'service.write',
}

export const ROLE_PERMISSIONS = {
  [ROLES.CUSTOMER]: [PERMISSIONS.ACCOUNT_READ],
  [ROLES.CMS_EDITOR]: [PERMISSIONS.ACCOUNT_READ, PERMISSIONS.CMS_READ, PERMISSIONS.CMS_DRAFT],
  [ROLES.CMS_REVIEWER]: [PERMISSIONS.ACCOUNT_READ, PERMISSIONS.CMS_READ, PERMISSIONS.CMS_PUBLISH],
  [ROLES.ADMIN]: ['*'],
  [ROLES.INVENTORY_MANAGER]: [
    PERMISSIONS.ACCOUNT_READ,
    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.INVENTORY_WRITE,
  ],
  [ROLES.SERVICE_MANAGER]: [
    PERMISSIONS.ACCOUNT_READ,
    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.SERVICE_WRITE,
  ],
}

export const ROLE_HOME = {
  [ROLES.CUSTOMER]: 'account',
  [ROLES.CMS_EDITOR]: 'cms',
  [ROLES.CMS_REVIEWER]: 'cms',
  [ROLES.ADMIN]: 'admin',
  [ROLES.INVENTORY_MANAGER]: 'admin',
  [ROLES.SERVICE_MANAGER]: 'admin',
}

export const APP_ROLES = {
  account: Object.values(ROLES),
  cms: [ROLES.CMS_EDITOR, ROLES.CMS_REVIEWER, ROLES.ADMIN],
  admin: [ROLES.ADMIN, ROLES.INVENTORY_MANAGER, ROLES.SERVICE_MANAGER],
}

export const ROLE_LABELS = {
  [ROLES.CUSTOMER]: 'Customer',
  [ROLES.CMS_EDITOR]: 'CMS editor',
  [ROLES.CMS_REVIEWER]: 'CMS reviewer',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.INVENTORY_MANAGER]: 'Inventory manager',
  [ROLES.SERVICE_MANAGER]: 'Service manager',
}

export function permissionsFor(role) {
  return ROLE_PERMISSIONS[role] ?? []
}

export function hasPermission(role, permission) {
  const list = permissionsFor(role)
  return list.includes('*') || list.includes(permission)
}

export function homeRouteName(role) {
  return ROLE_HOME[role] ?? 'account'
}

export function roleLabel(role) {
  return ROLE_LABELS[role] ?? role
}

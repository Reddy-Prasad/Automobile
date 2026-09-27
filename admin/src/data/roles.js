export const ROLES = {
  ADMIN: 'ADMIN',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  SERVICE_MANAGER: 'SERVICE_MANAGER',
}

export const PERMISSIONS = {
  ADMIN_READ: 'admin.read',
  INVENTORY_WRITE: 'inventory.write',
  SERVICE_WRITE: 'service.write',
  LEADS_WRITE: 'leads.write',
  USERS_MANAGE: 'users.manage',
  SETTINGS_WRITE: 'settings.write',
  REPORTS_READ: 'reports.read',
}

export const ROLE_PERMISSIONS = {
  [ROLES.INVENTORY_MANAGER]: [
    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.INVENTORY_WRITE,
    PERMISSIONS.REPORTS_READ,
  ],
  [ROLES.SERVICE_MANAGER]: [
    PERMISSIONS.ADMIN_READ,
    PERMISSIONS.SERVICE_WRITE,
    PERMISSIONS.REPORTS_READ,
  ],
  [ROLES.ADMIN]: ['*'],
}

export const ADMIN_ROLES = [ROLES.ADMIN, ROLES.INVENTORY_MANAGER, ROLES.SERVICE_MANAGER]

export const ROLE_LABELS = {
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

export function roleLabel(role) {
  return ROLE_LABELS[role] ?? role
}

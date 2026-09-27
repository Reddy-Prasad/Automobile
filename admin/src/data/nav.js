import { PERMISSIONS } from './roles'

export const SIDEBAR_ITEMS = [
  { to: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: 'inventory', label: 'Inventory', icon: 'bi-car-front', permission: PERMISSIONS.ADMIN_READ },
  { to: 'customers', label: 'Customers', icon: 'bi-person', permission: PERMISSIONS.ADMIN_READ },
  { to: 'leads', label: 'Leads', icon: 'bi-funnel', permission: PERMISSIONS.ADMIN_READ },
  { to: 'testdrives', label: 'Test Drives', icon: 'bi-calendar-check', permission: PERMISSIONS.ADMIN_READ },
  { to: 'service', label: 'Service', icon: 'bi-tools', permission: PERMISSIONS.ADMIN_READ },
  { to: 'finance', label: 'Finance', icon: 'bi-calculator', permission: PERMISSIONS.ADMIN_READ },
  { to: 'tradeins', label: 'Trade-ins', icon: 'bi-arrow-left-right', permission: PERMISSIONS.ADMIN_READ },
  { to: 'dealers', label: 'Dealers', icon: 'bi-geo-alt', permission: PERMISSIONS.ADMIN_READ },
  { to: 'users', label: 'Users', icon: 'bi-people', permission: PERMISSIONS.USERS_MANAGE },
  { to: 'roles', label: 'Roles', icon: 'bi-shield-lock', permission: PERMISSIONS.USERS_MANAGE },
  { to: 'reports', label: 'Reports', icon: 'bi-graph-up', permission: PERMISSIONS.REPORTS_READ },
  { to: 'settings', label: 'Settings', icon: 'bi-gear', permission: PERMISSIONS.SETTINGS_WRITE },
]

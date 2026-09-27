import { createRouter, createWebHistory } from 'vue-router'
import { ADMIN_ROLES, PERMISSIONS } from '@/data/roles'
import AdminLayout from '@/layouts/AdminLayout.vue'
import LoginView from '@/views/LoginView.vue'

const staff = { requiresAuth: true, roles: ADMIN_ROLES }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/admin/dashboard' },
    {
      path: '/admin/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: staff,
      children: [
        { path: '', redirect: { name: 'dashboard' } },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('@/views/InventoryView.vue'),
        },
        {
          path: 'inventory/new',
          name: 'inventory-new',
          component: () => import('@/views/VehicleFormView.vue'),
          meta: { permission: PERMISSIONS.INVENTORY_WRITE },
        },
        {
          path: 'inventory/:id/edit',
          name: 'inventory-edit',
          component: () => import('@/views/VehicleFormView.vue'),
          meta: { permission: PERMISSIONS.INVENTORY_WRITE },
        },
        {
          path: 'inventory/:id',
          name: 'inventory-view',
          component: () => import('@/views/VehicleView.vue'),
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => import('@/views/BoardView.vue'),
          props: { type: 'customers' },
        },
        {
          path: 'leads',
          name: 'leads',
          component: () => import('@/views/BoardView.vue'),
          props: { type: 'leads' },
        },
        {
          path: 'test-drives',
          name: 'testdrives',
          component: () => import('@/views/BoardView.vue'),
          props: { type: 'testdrives' },
        },
        {
          path: 'service',
          name: 'service',
          component: () => import('@/views/BoardView.vue'),
          props: { type: 'service' },
        },
        {
          path: 'finance',
          name: 'finance',
          component: () => import('@/views/BoardView.vue'),
          props: { type: 'finance' },
        },
        {
          path: 'trade-ins',
          name: 'tradeins',
          component: () => import('@/views/BoardView.vue'),
          props: { type: 'tradeins' },
        },
        {
          path: 'dealers',
          name: 'dealers',
          component: () => import('@/views/DealersView.vue'),
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/UsersView.vue'),
          meta: { permission: PERMISSIONS.USERS_MANAGE },
        },
        {
          path: 'roles',
          name: 'roles',
          component: () => import('@/views/RolesView.vue'),
          meta: { permission: PERMISSIONS.USERS_MANAGE },
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/ReportsView.vue'),
          meta: { permission: PERMISSIONS.REPORTS_READ },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue'),
          meta: { permission: PERMISSIONS.SETTINGS_WRITE },
        },
      ],
    },
    {
      path: '/admin/forbidden',
      name: 'forbidden',
      component: () => import('@/views/ForbiddenView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router

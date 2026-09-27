import { createRouter, createWebHistory } from 'vue-router'
import { APP_ROLES } from '@/data/roles'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('@/views/VehiclesView.vue'),
    },
    {
      path: '/vehicles/:id',
      name: 'vehicle-details',
      component: () => import('@/views/VehicleDetailsView.vue'),
      props: true,
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('@/views/RequestsView.vue'),
    },
    {
      path: '/saved',
      name: 'saved',
      component: () => import('@/views/FavoritesView.vue'),
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/CompareView.vue'),
    },
    {
      path: '/finance',
      name: 'finance',
      component: () => import('@/views/FinanceView.vue'),
    },
    {
      path: '/test-drive',
      name: 'test-drive',
      component: () => import('@/views/TestDriveView.vue'),
    },
    {
      path: '/service',
      name: 'service',
      component: () => import('@/views/ServiceView.vue'),
    },
    {
      path: '/trade-in',
      name: 'trade-in',
      component: () => import('@/views/TradeInView.vue'),
    },
    {
      path: '/credits',
      name: 'credits',
      component: () => import('@/views/CreditsView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('@/views/AccountView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/cms',
      name: 'cms',
      component: () => import('@/views/CmsHomeView.vue'),
      meta: { requiresAuth: true, roles: APP_ROLES.cms },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminHomeView.vue'),
      meta: { requiresAuth: true, roles: APP_ROLES.admin },
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('@/views/ForbiddenView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router

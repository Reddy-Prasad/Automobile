import { createRouter, createWebHistory } from 'vue-router'
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
      path: '/credits',
      name: 'credits',
      component: () => import('@/views/CreditsView.vue'),
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

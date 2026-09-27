import { createRouter, createWebHistory } from 'vue-router'
import { CMS_ROLES } from '@/data/roles'
import CmsLayout from '@/layouts/CmsLayout.vue'
import LoginView from '@/views/LoginView.vue'

const staff = { requiresAuth: true, roles: CMS_ROLES }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/cms/dashboard' },
    {
      path: '/cms/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/cms',
      component: CmsLayout,
      meta: staff,
      children: [
        { path: '', redirect: { name: 'dashboard' } },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'homepage',
          name: 'homepage',
          component: () => import('@/views/EditorView.vue'),
          props: { type: 'homepage' },
        },
        {
          path: 'pages',
          name: 'pages',
          component: () => import('@/views/CollectionView.vue'),
          props: { type: 'pages' },
        },
        {
          path: 'pages/:id',
          name: 'pages-edit',
          component: () => import('@/views/EditorView.vue'),
          props: (route) => ({ type: 'pages', id: route.params.id }),
        },
        {
          path: 'banners',
          name: 'banners',
          component: () => import('@/views/CollectionView.vue'),
          props: { type: 'banners' },
        },
        {
          path: 'banners/:id',
          name: 'banners-edit',
          component: () => import('@/views/EditorView.vue'),
          props: (route) => ({ type: 'banners', id: route.params.id }),
        },
        {
          path: 'offers',
          name: 'offers',
          component: () => import('@/views/CollectionView.vue'),
          props: { type: 'offers' },
        },
        {
          path: 'offers/:id',
          name: 'offers-edit',
          component: () => import('@/views/EditorView.vue'),
          props: (route) => ({ type: 'offers', id: route.params.id }),
        },
        {
          path: 'media',
          name: 'media',
          component: () => import('@/views/CollectionView.vue'),
          props: { type: 'media' },
        },
        {
          path: 'media/:id',
          name: 'media-edit',
          component: () => import('@/views/EditorView.vue'),
          props: (route) => ({ type: 'media', id: route.params.id }),
        },
        {
          path: 'seo',
          name: 'seo',
          component: () => import('@/views/EditorView.vue'),
          props: { type: 'seo' },
        },
        {
          path: 'navigation',
          name: 'navigation',
          component: () => import('@/views/EditorView.vue'),
          props: { type: 'navigation' },
        },
        {
          path: 'footer',
          name: 'footer',
          component: () => import('@/views/EditorView.vue'),
          props: { type: 'footer' },
        },
      ],
    },
    {
      path: '/cms/forbidden',
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

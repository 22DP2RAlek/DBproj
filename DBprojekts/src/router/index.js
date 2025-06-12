import { createRouter, createWebHistory } from 'vue-router'

// Import views that exist
import Home from '../views/home.vue'
import Cards from '../views/cards.vue'
import Login from '@/views/login.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/cards',
    name: 'cards',
    component: () => import('../views/cards.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register.vue')
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/map.vue')
  },
  {
  path: '/review',
  name: 'review',
  component: () => import('@/views/review.vue')
  },
  {
  path: '/savedSpots',
  name: 'savedSpots',
  component: () => import('@/views/savedSpots.vue')
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

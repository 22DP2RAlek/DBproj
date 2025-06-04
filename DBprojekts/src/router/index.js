import { createRouter, createWebHistory } from 'vue-router'

// Import views that exist
import Home from '../views/home.vue'
import Cards from '../views/cards.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/cards',
    name: 'cards',
    component: Cards,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

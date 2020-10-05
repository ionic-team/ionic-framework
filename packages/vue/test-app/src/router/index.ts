import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/overlays',
    name: 'Overlays',
    component: () => import('@/views/Overlays.vue')
  },
  {
    path: '/inputs',
    name: 'Inputs',
    component: () => import('@/views/Inputs.vue')
  },
  {
    path: '/slides',
    name: 'Slides',
    component: () => import('@/views/Slides.vue')
  },
  {
    path: '/navigation',
    name: 'Navigation',
    component: () => import('@/views/Navigation.vue')
  },
  {
    path: '/nested',
    name: 'RouterOutlet',
    component: () => import('@/views/RouterOutlet.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/NestedChild.vue')
      },
      {
        path: 'two',
        component: () => import('@/views/NestedChildTwo.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

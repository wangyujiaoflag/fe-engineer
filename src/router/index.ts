import { createRouter, createWebHashHistory } from 'vue-router'
import HelloWorld from '@/views/HelloWorld.vue'

const routes = [
  {
    path: '/',
    component: HelloWorld,
  },
  {
    path: '/test',
    component: () => import('@/views/TestPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

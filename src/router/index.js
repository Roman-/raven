import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "@/views/Home.vue";
import ImageGenOnly from "@/views/ImageGenOnly.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/img',
    name: 'img',
    component: ImageGenOnly
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

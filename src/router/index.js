import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "@/views/Home.vue";

const routes = [
  {
    path: '/',
    name: 'hove',
    component: Home
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

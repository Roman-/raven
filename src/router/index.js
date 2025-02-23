import { createRouter, createWebHashHistory } from 'vue-router'
import Home from "@/views/Home.vue";
import Game from "@/views/Game.vue";
import FlavorDesign from "@/views/FlavorDesign.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: Game
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
  {
    path: '/designer',
    name: 'designer',
    component: FlavorDesign
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

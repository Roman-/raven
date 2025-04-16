import { createRouter, createWebHashHistory } from 'vue-router'
import Game from "@/views/Game.vue";
import FlavorDesign from "@/views/FlavorDesign.vue";
import Wallpaper from "@/views/Wallpaper.vue";

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
  },
  {
    path: '/wallpaper',
    name: 'wallpaper',
    component: Wallpaper
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

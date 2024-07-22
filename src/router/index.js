import { createRouter, createWebHashHistory } from 'vue-router'
import UploadOrChoose from "@/views/UploadOrChoose.vue";
import Crop from "@/views/Crop.vue";

const routes = [
  {
    path: '/',
    name: 'upload_or_choose',
    component: UploadOrChoose
  },
  {
    path: '/crop',
    name: 'crop',
    component: Crop
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

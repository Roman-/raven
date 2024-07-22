import { createRouter, createWebHashHistory } from 'vue-router'
import UploadOrChoose from "@/views/UploadOrChoose.vue";
import Crop from "@/views/Crop.vue";
import Method from "@/views/Method.vue";

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
  {
    path: '/method',
    name: 'method',
    component: Method
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

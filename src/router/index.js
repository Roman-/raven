import { createRouter, createWebHashHistory } from 'vue-router'
import UploadOrChoose from "@/views/UploadOrChoose.vue";

const routes = [
  {
    path: '/',
    name: 'upload_or_choose',
    component: UploadOrChoose
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

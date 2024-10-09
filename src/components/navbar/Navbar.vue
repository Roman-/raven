<script setup>

import { store } from "@/store/store";
import {useRouter} from "vue-router";
import ThemeController from "@/components/navbar/ThemeController.vue";

const router = useRouter();

</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl" @click="router.push('/')">__VUE_TEMPLATE__</a>
    </div>
    <div class="flex-none">
      <ThemeController/>
    </div>
  </div>
</template>

<style scoped>

</style>

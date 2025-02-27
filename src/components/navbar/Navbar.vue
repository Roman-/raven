<script setup>

import {useRouter} from "vue-router";
import ThemeController from "@/components/navbar/ThemeController.vue";
import DifficultyInput from "@/components/navbar/DifficultyInput.vue";

const router = useRouter();

</script>

<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl" @click="router.push('/')">Raven</a>
    </div>
    <div class="flex-none">
      <DifficultyInput />
      <ThemeController />
    </div>
  </div>
</template>

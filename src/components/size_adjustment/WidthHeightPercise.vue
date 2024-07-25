<script setup>
import {ref} from "vue";

const width = ref(20)
const height = ref(30)
</script>

<template>
  <div class="text-center">
    Size:
  </div>
  <div class="flex items-center">
    <input
        type="number"
        min="1"
        placeholder="width"
        class="input input-bordered w-full max-w-xs m-1"
        v-model="width"
    />
    <span>x</span>
    <input
        type="number"
        min="1"
        placeholder="width"
        class="input input-bordered w-full max-w-xs m-1"
        v-model="height"
    />
  </div>

  <div class="divider">
    {{width * height}} px
  </div>
</template>

<style scoped>

</style>
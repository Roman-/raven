<script setup>

import {onMounted, ref, watch} from "vue";
import {store} from "@/store/store";

const sizes = [
  {
    name: "square",
    size: [30, 30]
  },
  {
    name: "portrait",
    size: [30, 40]
  },
  {
    name: "landscape",
    size: [40, 30]
  },
]

const selectedIndex = ref(0)
watch(selectedIndex, () => {
  store.commit('setPixelSize', sizes[selectedIndex.value].size)
  console.log(selectedIndex.value)
})
onMounted(() => {
  store.commit('setPixelSize', sizes[0].size)
})
</script>

<template>
  <select
      v-model="selectedIndex"
      class="select select-primary w-full max-w-xs">
    <option
        v-for="(size, index) in sizes"
        :key="index"
        :value="index">
      {{ size.name }}
    </option>
  </select>
</template>

<style scoped>

</style>
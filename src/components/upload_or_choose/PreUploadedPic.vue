<script setup>
import {computed, defineProps} from 'vue';
import {store} from "@/store/store";

const props = defineProps({
  pic: String
})

</script>

<template>

<div class="bg-gray-400 cursor-pointer h-32 w-64 rounded-2xl overflow-hidden m-2 flex">
  <img v-if="props.pic !== ''"
      class="w-full object-cover cursor-pointer"
      :src="props.pic"
      alt="img">
  <div v-else class="flex w-full justify-center items-center">
    <div class="text-2xl p-2" @click="store.commit('increment', 10)">
      +
    </div>
  </div>
</div>

</template>
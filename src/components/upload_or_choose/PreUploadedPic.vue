<script setup>
import {computed, defineProps} from 'vue';
import {store} from "@/store/store";

const props = defineProps({
  pic: String
})
const isUploadBtn = computed(() => props.pic === '');
const onClicked = () => {
  console.log("isUploadBtn ? ", isUploadBtn.value);
  if (isUploadBtn.value) {
    store.commit('decrementCoins')
  }
}
</script>

<template>
<div
    @click="onClicked"
    class="bg-gray-400 cursor-pointer h-32 w-64 rounded-2xl overflow-hidden m-2 flex">
  <div v-if="isUploadBtn" class="flex w-full justify-center items-center">
    <div class="text-2xl p-2">
      +
    </div>
  </div>
  <img v-else
       class="w-full object-cover cursor-pointer"
       :src="props.pic"
       alt="img">
</div>

</template>
<script setup>
import {store} from "@/store/store";
import {onMounted, ref} from "vue";
import router from "@/router";

onMounted(() => {
  if (store.state.croppedImageSrc === null) {
    router.push('/')
  }
})

const onMethodSelected = () => {
  router.push('/')
}

</script>

<template>
  <div class="flex">
    <div class="w-72">
      <div class="text-center">
        Adjustments:
      </div>

      <div class="divider">
        continue?
      </div>
      <div class="flex mx-2">
        <button class="btn btn-success w-full" @click="onMethodSelected">
          Next
        </button>
      </div>

    </div>
    <div class="w-full h-80vh bg-gray-400">
      <img class="w-full h-full" :src="store.state.croppedImageSrc ?? ''"
           alt="cropped">
    </div>
  </div>
</template>
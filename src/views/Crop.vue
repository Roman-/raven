<script setup>
import {store} from "@/store/store";
import {onMounted, ref} from "vue";
import router from "@/router";
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

let cropper = null

onMounted(() => {
  if (store.state.originalImage === null) { router.push('/') }
})

const onCropFinished = () => {
  // TODO save cropped to store; check coins etc.
  router.push('method')
}

</script>

<template>
  <div class="flex justify-between items-center">
    <button class="btn" @click="router.push('/')">
      Back
    </button>
    <div>
      Crop image
    </div>
    <button class="btn mx-2" @click="onCropFinished">
      Next
    </button>
  </div>
  <div class="flex">
    <VueCropper
        class="w-full h-80vh"
        ref="cropper"
        :src="store.state.originalImage?.src ?? ''"/>
  </div>
</template>

<style scoped>
.h-80vh {
  height: 80vh;
}
</style>
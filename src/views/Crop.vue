<script setup>
import {store} from "@/store/store";
import {onMounted, ref} from "vue";
import router from "@/router";
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

let cropper = null

onMounted(() => {
  if (store.state.originalImage === null) {
    router.push('/')
  }
})

const onCropFinished = () => {
  // TODO save cropped to store; check coins etc.
  router.push('method')
}

const width = ref(20)
const height = ref(30)

</script>

<template>
  <div class="flex">
    <div class="w-72">
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
      <div class="flex mx-2">
        <button class="btn btn-success w-full" @click="onCropFinished">
          Next
        </button>
      </div>

    </div>
<!--    <div class="bg-amber-800 w-full h-80vh">cropper</div>-->
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
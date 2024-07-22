<script setup>
import {store} from "@/store/store";
import {onMounted, ref} from "vue";
import router from "@/router";
const imgElement = ref(null)
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

let cropper = null

onMounted(() => {
  if (store.state.originalImage === null) {
    router.push('/')
    return
  }
  // imgElement.value.addEventListener('load')
  // imgElement.value.src = store.state.originalImage.src
})

</script>

<template>
  <div>
    Crop image:
  </div>
  <div class="flex h-full">
    <img
        class="w-full"
        :src="store.state.originalImage?.src ?? ''"/>

    <!--
        <vue-cropper
            class="w-full"
            ref="cropper"
            :src="store.state.originalImage?.src ?? ''"/>
    -->
  </div>
</template>

<style scoped>
</style>
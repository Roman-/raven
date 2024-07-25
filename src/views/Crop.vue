<script setup>
import {store} from "@/store/store";
import {onMounted, ref, watch} from "vue";
import router from "@/router";
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import SizeWood from "@/components/size_adjustment/SizeWood.vue";

let cropper = null

onMounted(() => {
  if (store.state.originalImage === null) {
    router.push('/')
  }
})

const onCropFinished = () => {
  store.commit('setCroppedImg',
      cropper.getCroppedCanvas({fillColor: '#fff'}).toDataURL())
  router.push('method')
}

watch(() => store.state.pixelSize, () => {
  cropper.setAspectRatio(store.state.pixelSize[0]/store.state.pixelSize[1])
})

</script>

<template>
  <div class="flex">
    <div class="w-72">
      <SizeWood/>
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
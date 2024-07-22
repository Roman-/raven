<script setup>
import {computed, defineProps} from 'vue';
import {store} from "@/store/store";
import {useRouter} from "vue-router";
const router = useRouter();

const props = defineProps({
  uuid: String
})
const imgSrc = computed(() => `/img/user_uploads/${props.uuid}.jpg`)

const isUploadBtn = computed(() => props.uuid === '');
const onClicked = () => {
  console.log("isUploadBtn ? ", isUploadBtn.value);
  if (isUploadBtn.value) {
    store.commit('decrementCoins')
    // load from file, init crop with it
  } else {
    router.push('crop')
    // load existing one by image-uuid
    store.commit('setImgSrc', imgSrc.value, ()=>{router.push('crop')})
  }
}
</script>

<template>
<div
    @click="onClicked"
    class="bg-gray-400 cursor-pointer h-32 w-64 rounded-2xl overflow-hidden m-2 flex">
  <div v-if="isUploadBtn" class="flex w-full justify-center items-center text-2xl hover:text-3xl">
    <div class="p-2">
      +
    </div>
  </div>
  <img v-else
       class="w-full object-cover cursor-pointer hover:opacity-80"
       :src="imgSrc"
       alt="img">
</div>

</template>
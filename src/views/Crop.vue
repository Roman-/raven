<script setup>

import {store} from "@/store/store";
</script>

<template>
  <div>
    crop with cropjs lib
  </div>
  <div>
    <img :src="store.state.originalImage.src" alt="originalImage">
  </div>
</template>

<style scoped>

</style>
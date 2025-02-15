<script setup>
import {generate2dGrid} from "@/js/generators";
import {ref} from "vue";

const variants = ref([])

for (let i = 0; i < 10; i++) {
  variants.value.push(JSON.stringify(generate2dGrid()))
}
generate2dGrid
</script>

<template>
  <div v-for="v in variants">
    {{v}}
  </div>
</template>

<script setup>
import {store} from "@/store/store";

const onChange = (event) => {
  store.commit('setDifficulty', parseInt(event.target.value))
  store.commit('generate')
}
</script>

<template>
  <span class="label">Level</span>
  <input type="range" min="1" max="3" class="range" step="1"
         :value="store.state.difficulty"
         @input="onChange"
  />
</template>
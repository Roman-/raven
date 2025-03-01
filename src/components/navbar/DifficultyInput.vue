<script setup>
import { store } from "@/store/store";

const decreaseDifficulty = () => {
  // Prevent going below 1
  if (store.state.difficulty > 1) {
    store.commit("setDifficulty", store.state.difficulty - 1);
    store.commit("generate");
  }
};

const increaseDifficulty = () => {
  // Prevent going above 3
  if (store.state.difficulty < 3) {
    store.commit("setDifficulty", store.state.difficulty + 1);
    store.commit("generate");
  }
};
</script>

<template>
  <div class="flex items-center space-x-2">
    <button class="btn btn-sm" @click="decreaseDifficulty">-</button>
    <span class="label-text">Level {{ store.state.difficulty }}</span>
    <button class="btn btn-sm" @click="increaseDifficulty">+</button>
  </div>
</template>

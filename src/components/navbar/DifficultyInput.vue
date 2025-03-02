<script setup>
import { store } from "@/store/store";

const maxDifficulty = 4; // inclusive

const decreaseDifficulty = () => {
  if (store.state.difficulty <= 1) {
    return;
  }
  store.commit("setDifficulty", store.state.difficulty - 1);
  store.commit("generate");
};

const increaseDifficulty = () => {
  if (store.state.difficulty >= maxDifficulty) {
    return;
  }
  store.commit("setDifficulty", store.state.difficulty + 1);
  store.commit("generate");
};
</script>

<template>
  <div class="flex items-center space-x-2">
    <button class="btn btn-sm" @click="decreaseDifficulty">-</button>
    <span class="label-text">Level {{ store.state.difficulty }}</span>
    <button class="btn btn-sm" @click="increaseDifficulty">+</button>
  </div>
</template>

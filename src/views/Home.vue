<script setup>
import { onMounted, ref } from 'vue';
import {generate2dGrid, generateThreeColors, generateThreeEmojis} from "@/js/generators";
import {drawGrid} from "@/js/drawers";

const cellSize = ref(200); // The pixel size of each cell in the grid
const myCanvas = ref(null);

const generate = () => {
  const canvas = myCanvas.value;
  const ctx = canvas.getContext('2d');
  const grid = generate2dGrid()
  const propPicks = {
    "fg": generateThreeEmojis(true),
    "bg": generateThreeColors(true),
  };

  drawGrid(grid, propPicks, ctx, cellSize.value);
}

onMounted(() => {
  generate()
});

</script>

<template>
  <canvas ref="myCanvas" :width="cellSize * 3" :height="cellSize * 3"></canvas>
  <button class="btn btn-primary mt-5" @click="generate">
    Generate
  </button>
<!--  cell size range-->
  <input type="range" min="100" max="500" v-model="cellSize">

</template>


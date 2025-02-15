<script setup>
import { onMounted, ref } from 'vue';
import {generate2dGrid, generateThreeColors, generateThreeEmojis} from "@/js/generators";
import {drawGrid} from "@/js/drawers";

const canvasSize = ref(600); // The pixel size of each cell in the grid
const myCanvas = ref(null);

const generate = () => {
  const canvas = myCanvas.value;
  const ctx = canvas.getContext('2d');
  const grid = generate2dGrid()
  const propPicks = {
    "fg": generateThreeEmojis(true),
    "bg": generateThreeColors(true),
  };

  drawGrid(grid, propPicks, ctx, canvasSize.value);
}

onMounted(() => {
  // minimum of (screen width, screen height) * 0.9
  canvasSize.value = Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.95);
  setTimeout(generate, 100);
});


</script>

<template>
  <div class="flex flex-col align-items-center justify-content-center">
    <canvas ref="myCanvas" :width="canvasSize" :height="canvasSize"></canvas>
    <div class="flex">
      <button v-for="">

      </button>
    </div>
  </div>

</template>


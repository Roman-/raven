<script setup>
import { onMounted, ref } from 'vue';
import {generate2dGrid, generateThreeColors, generateThreeEmojis} from "@/js/generators";

const cellSize = ref(100); // The pixel size of each cell in the grid
const myCanvas = ref(null);

// Helper function to draw one square
function drawSquare(ctx, row, col, cellSize, letter, color) {
  const x = col * cellSize;
  const y = row * cellSize;

  // Draw the cell background
  ctx.fillStyle = color;
  ctx.fillRect(x, y, cellSize, cellSize);

  // Draw the foreground text (letter)
  ctx.fillStyle = "#000";
  ctx.font = "60px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, x + cellSize / 2, y + cellSize / 2);
}

function drawGrid(grid, propPicks, ctx) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      // The value at grid[row][col] is the index in propPicks arrays
      const index = grid[row][col];
      const letter = propPicks.fg[index];
      const color = propPicks.bg[index];

      drawSquare(ctx, row, col, cellSize.value, letter, color);
    }
  }
}

const generate = () => {
  const canvas = myCanvas.value;
  const ctx = canvas.getContext('2d');
  const grid = generate2dGrid()
  const propPicks = {
    "fg": generateThreeEmojis(true),
    "bg": generateThreeColors(true),
  };

  drawGrid(grid, propPicks, ctx);
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
</template>


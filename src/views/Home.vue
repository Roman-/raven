<script setup>
import { onMounted, ref } from 'vue';
import {generateSetOfGrids, generateSetOfGridsMaximumDifficulty} from "@/js/grids";
import {generateCellsAndAnswers} from "@/js/generator";
import {shapeFlavor} from "@/js/puzzle_flavors/shape_flavor";
import {drawPuzzleGrid} from "@/js/draw_puzzle";

const canvasWidth = ref(500);
const canvasHeight = ref(500);
const myCanvas = ref(null);

onMounted(() => {
  const flavor = shapeFlavor;
  const cellsAndAnswers = generateCellsAndAnswers(generateSetOfGridsMaximumDifficulty(2), flavor, 6);
  console.log(cellsAndAnswers);
  drawPuzzleGrid(myCanvas.value.getContext('2d'), 0, 0, canvasWidth.value, cellsAndAnswers.cells, flavor.drawCell);
})

</script>

<template>
  <div class="flex justify-center gap-2 mt-4">
    <canvas ref="myCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>


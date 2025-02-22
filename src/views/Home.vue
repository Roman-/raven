<script setup>
import { onMounted, ref } from 'vue';
import {ShapeGenerator} from "@/js/shape_generator";
import {ShapeDrawer} from "@/js/shape_drawer";
import {generateSetOfGrids, generateSetOfGridsMaximumDifficulty} from "@/js/grids";

const canvasWidth = ref(500);
const canvasHeight = ref(500);
const myCanvas = ref(null);

onMounted(() => {
  let gen = new ShapeGenerator;
  let puzzle = gen.generate(generateSetOfGrids(4, 1), 6);
  console.log(puzzle);

  const drawer = new ShapeDrawer;
  drawer.drawPuzzle(myCanvas.value.getContext('2d'), 0, 0, canvasWidth.value, puzzle.puzzle);

})

</script>

<template>
  <div class="flex justify-center gap-2 mt-4">
    <canvas ref="myCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>


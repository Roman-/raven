<script setup>
import { onMounted, ref } from 'vue';
import {drawPuzzleGrid} from "@/js/draw_puzzle";
import {store} from "@/store/store";

const puzzleCanvasSize = ref(0);
const puzzleCanvas = ref(null);

onMounted(() => {
  // min of window w/h * 0.8
  puzzleCanvasSize.value = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.8);
  store.commit('generate');
  setTimeout(draw, 1);
})

const draw = () => {
  drawPuzzleGrid(puzzleCanvas.value.getContext('2d'), 0, 0,
      puzzleCanvasSize.value, store.getters.cells, store.getters.drawShapeFunction);
}

</script>

<template>
  <div class="flex justify-center gap-2 mt-4">
    <canvas ref="puzzleCanvas" :width="puzzleCanvasSize" :height="puzzleCanvasSize"/>
  </div>
</template>


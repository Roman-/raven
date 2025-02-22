<script setup>
import {onMounted, ref, watch} from 'vue';
import {drawPuzzleGrid} from "@/js/draw_puzzle";
import {store} from "@/store/store";

const puzzleCanvasSize = ref(0);
const puzzleCanvas = ref(null);

onMounted(() => {
  watch( () => store.state.cellsAndAnswers, draw, { deep: true } )
  puzzleCanvasSize.value = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.8);
  setTimeout(() => {store.commit('generate')}, 1);
})

const draw = () => {
  let ctx = puzzleCanvas.value.getContext('2d');
  ctx.clearRect(0, 0, puzzleCanvasSize.value, puzzleCanvasSize.value);
  drawPuzzleGrid(ctx, 0, 0, puzzleCanvasSize.value, store.getters.cells, store.getters.drawShapeFunction);
}

</script>

<template>
  <div class="flex justify-center gap-2 mt-4">
    <canvas ref="puzzleCanvas" :width="puzzleCanvasSize" :height="puzzleCanvasSize"/>
  </div>
  <button class="btn btn-primary" @click="store.commit('generate')">Generate New Puzzle</button>
</template>


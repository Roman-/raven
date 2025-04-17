<script setup>
import {onMounted, ref, watch} from 'vue';
import {generateSetOfGridsMaximumDifficulty} from "@/js/grids";
import {generateCellsAndAnswers} from "@/js/generator";
import {seededRandom} from "@/js/helpers";
import {shapeUnionFlavor} from "@/js/puzzle_flavors/ShapeUnionFlavor";
import {store} from "@/store/store";
import {drawPuzzleGrid} from "@/js/drawer";
import {concentricCirclesFlavor} from "@/js/puzzle_flavors/concentricCirclesFlavor";

// *****************************************************************************
// Change the flavor you're working with
// *****************************************************************************
const flavor = concentricCirclesFlavor;

const numFeatures = Object.keys(flavor.getFeaturesVariations()).length;
const numCanvases = 16
const answerCanvasSize = ref(100);
const puzzleCanvas = ref(null);
const cellsAndAnswers = ref(null);
const randomSeed = ref(1)

const generateNew = () => {
  randomSeed.value++
  updateSizes()
  cellsAndAnswers.value = generateCellsAndAnswers( generateSetOfGridsMaximumDifficulty(numFeatures), flavor, numCanvases );
  setTimeout(draw, 1)
}

const draw = () => {
  console.log("cellsAndAnswers.value.answers", cellsAndAnswers.value.answers);
  cellsAndAnswers.value.answers.forEach((answer, index) => {
    const canvas = document.getElementById(`answerCanvas${index}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, answerCanvasSize.value, answerCanvasSize.value);
    flavor.drawCell(ctx, answer, answerCanvasSize.value, seededRandom(randomSeed.value));
  });

  const puzzleCanvasSize = answerCanvasSize.value * 3;
  const ctx = puzzleCanvas.value.getContext('2d');
  ctx.clearRect(0, 0, puzzleCanvasSize, puzzleCanvasSize);
  drawPuzzleGrid(
      ctx,
      0,
      0,
      puzzleCanvasSize,
      cellsAndAnswers.value.cells,
      flavor.drawCell,
      randomSeed.value,
      'r'
  );
};

const updateSizes = () => {
  const screenSize = Math.round(Math.min(window.innerWidth, window.innerHeight))
  answerCanvasSize.value = Math.round(screenSize * 0.22);
};

onMounted(() => {
  setTimeout(generateNew, 100);
})

</script>

<template>
  <div>
    <button class="btn btn-primary" @click="generateNew">New '{{flavor.name}}'</button>
  </div>

  <div>
    <canvas
        ref="puzzleCanvas"
        :width="answerCanvasSize * 3"
        :height="answerCanvasSize * 3"
        class="border border-dashed"
    />
  </div>

  <div class="grid grid-cols-4 gap-2">
    <div
        v-for="(answer, index) in cellsAndAnswers?.answers || []"
        :key="index"
    >
      <canvas
          :id="`answerCanvas${index}`"
          :width="answerCanvasSize"
          :height="answerCanvasSize"
          class="border"
      />
    </div>
  </div>
</template>


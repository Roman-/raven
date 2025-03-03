<script setup>
import {onMounted, ref, watch} from 'vue';
import {generateSetOfGridsMaximumDifficulty} from "@/js/grids";
import {generateCellsAndAnswers} from "@/js/generator";
import {tiledLinesFlavor} from "@/js/puzzle_flavors/tiledLinesFlavor";
import {seededRandom} from "@/js/helpers";
import {store} from "@/store/store";
import {columnsOfCirclesFlavor} from "@/js/puzzle_flavors/columnsOfCirclesFlavor";
import {shapeUnionFlavor} from "@/js/puzzle_flavors/ShapeUnionFlavor";

// *****************************************************************************
// Change the flavor you're working with
// *****************************************************************************
const flavor = shapeUnionFlavor;

const numFeatures = Object.keys(flavor.getFeaturesVariations()).length;
const numCanvases = 16
const answerCanvasSize = ref(100);
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
    {{flavor.name}}
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

  <div class="flex justify-center gap-2 mt-4">
    <div>
      <button class="btn btn-primary" @click="generateNew">Generate New</button>
    </div>
    <div>
      {{randomSeed}}
    </div>
    <div>
      <button class="btn btn-accent" @click="randomSeed++ && generateNew">++</button>
    </div>

  </div>
</template>


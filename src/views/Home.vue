<script setup>
import { onMounted, ref } from 'vue';
import {generate2dGrid, generateThreeColors, generateThreeEmojis} from "@/js/generators";
import {drawGrid} from "@/js/drawers";

const canvasSize = ref(600); // The pixel size of each cell in the grid
const myCanvas = ref(null);

const possibleAnswers = ref([]);
const propPicks = ref(null)
const correctAnswer = ref(null);
const grid = ref(null)
const answerGiven = ref(false)

const reDraw = (withQuestionMark) => {
  const ctx = myCanvas.value.getContext('2d');
  drawGrid(grid.value, propPicks.value, ctx, canvasSize.value, withQuestionMark);
}

const generateAndDraw = () => {
  grid.value = generate2dGrid()
  propPicks.value = {
    "fg": generateThreeEmojis(true),
    "bg": generateThreeColors(true),
  };
  possibleAnswers.value = propPicks.value.fg
  const indexOfAnswer = grid.value[2][2];
  correctAnswer.value = propPicks.value.fg[indexOfAnswer];
  reDraw(true)
}

onMounted(() => {
  // minimum of (screen width, screen height) * 0.9
  canvasSize.value = Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.95);
  setTimeout(generateAndDraw, 100);
});

const onAnswerClick = (answer) => {
  const correct = answer === correctAnswer.value;
  if (correct) {
    answerGiven.value = true;
    reDraw(false)
  } else {
    // play animation
  }
};

const nextGame = () => {
  answerGiven.value = false;
  generateAndDraw();
}

</script>

<template>
  <div class="flex flex-col align-items-center justify-content-center">
    <canvas ref="myCanvas" :width="canvasSize" :height="canvasSize"></canvas>
    <div v-if="answerGiven" class="flex justify-around mt-4">
      <button class="text-5xl btn btn-outline btn-success btn-lg" @click="nextGame">
        Next →
      </button>
    </div>
    <div v-else class="flex justify-around mt-4">
      <button v-for="a in possibleAnswers"
              class="text-5xl btn btn-outline btn-neutral btn-lg"
              @click="onAnswerClick(a)">
        {{a}}
      </button>
    </div>
  </div>

</template>


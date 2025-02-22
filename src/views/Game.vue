<script setup>
import { onMounted, ref, watch } from 'vue';
import { store } from '@/store/store';
import { drawPuzzleGrid } from '@/js/drawer';

/**
 * We'll have one main canvas for the puzzle,
 * plus multiple small canvases for each answer.
 */

// Main puzzle dimension
const puzzleCanvasSize = ref(500);
const puzzleCanvas = ref(null);

// Each answer's canvas dimension
const answerCanvasSize = ref(100);

// We watch the store's puzzle/answers. Whenever they change (like on generate),
// we redraw the puzzle and answers.
const drawAll = () => {
  drawPuzzle();
  drawAllAnswers();
};

onMounted(() => {
  // Redraw whenever new puzzle is generated
  watch(
      () => store.state.cellsAndAnswers,
      drawAll,
      { deep: true }
  );

  // Also redraw if the reveal state changes (e.g., user picks an answer)
  watch(
      () => store.state.isAnswerRevealed,
      drawAll,
      { immediate: true }
  );

  // A simple approach for sizing the puzzle to window
  puzzleCanvasSize.value = Math.round(
      Math.min(window.innerWidth, window.innerHeight) * 0.5
  );
  // Let each answer be a fraction of the puzzle size
  answerCanvasSize.value = Math.round(puzzleCanvasSize.value * 0.2);

  // Generate puzzle on mount
  setTimeout(() => {
    store.commit('generate');
  }, 1);
});

/** Draw the 3x3 puzzle with one question mark cell. */
const drawPuzzle = () => {
  if (!puzzleCanvas.value) return;
  const ctx = puzzleCanvas.value.getContext('2d');
  ctx.clearRect(0, 0, puzzleCanvasSize.value, puzzleCanvasSize.value);

  const cells = store.getters.cells;

  drawPuzzleGrid(
      ctx,
      0,
      0,
      puzzleCanvasSize.value,
      cells,
      store.getters.drawCell
  );
};

/** Draw each answer in its own small canvas. */
const drawAllAnswers = () => {
  store.getters.answers.forEach((answer, index) => {
    const canvas = document.getElementById(`answerCanvas${index}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, answerCanvasSize.value, answerCanvasSize.value);

    // If we want to highlight the correct answer after reveal
    if (store.state.isAnswerRevealed && index === store.getters.correctAnswerIndex) {
      ctx.fillStyle = '#ccffcc'; // light-green highlight
      ctx.fillRect(0, 0, answerCanvasSize.value, answerCanvasSize.value);
    }

    // draw the shape for this answer
    store.getters.drawCell(ctx, answer, 0, 0, answerCanvasSize.value);
  });
};

/** Handle user clicks on an answer. */
const onAnswerClicked = (index) => {
  if (!store.state.isAnswerRevealed) {
    store.commit('selectAnswer', index);
  }
};
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Puzzle Canvas -->
    <canvas
        ref="puzzleCanvas"
        :width="puzzleCanvasSize"
        :height="puzzleCanvasSize"
        class="border border-gray-400"
    ></canvas>

    <!-- Answers Row -->
    <div class="flex gap-4 mt-6">
      <div
          v-for="(answer, index) in store.getters.answers"
          :key="index"
          class="cursor-pointer"
      >
        <canvas
            :id="`answerCanvas${index}`"
            :width="answerCanvasSize"
            :height="answerCanvasSize"
            class="border border-gray-300"
            @click="onAnswerClicked(index)"
        />
      </div>
    </div>

    <!-- After picking an answer, reveal correctness -->
    <div v-if="store.state.isAnswerRevealed" class="mt-4 text-center">
      <p v-if="store.getters.isAnswerCorrect" class="text-green-600 text-lg">
        Correct!
      </p>
      <p v-else class="text-red-600 text-lg">
        Wrong!
      </p>
      <p>The correct choice is answer #{{ store.getters.correctAnswerIndex + 1 }}</p>
      <button class="btn btn-primary mt-4" @click="store.commit('generate')">
        Next Puzzle
      </button>
    </div>
  </div>
</template>

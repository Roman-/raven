<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { store } from '@/store/store';
import { drawPuzzleGrid } from '@/js/drawer';

// Main puzzle dimension
const puzzleCanvasSize = ref(500);
const puzzleCanvas = ref(null);

// Each answer's canvas dimension
const answerCanvasSize = ref(100);

// Watch the store's puzzle/answers to redraw
const drawAll = () => {
  setTimeout(() => {drawPuzzle()}, 1);
  setTimeout(() => {drawAllAnswers()}, 1);
};

const drawPuzzle = () => {
  if (!puzzleCanvas.value) return;
  const ctx = puzzleCanvas.value.getContext('2d');
  ctx.clearRect(0, 0, puzzleCanvasSize.value, puzzleCanvasSize.value);

  const cells = store.getters.cells;

  // Pass in revealAnswer = store.state.isAnswerRevealed
  drawPuzzleGrid(
      ctx,
      0,
      0,
      puzzleCanvasSize.value,
      cells,
      store.getters.drawCell,
      store.state.isAnswerRevealed
  );
};

const drawAllAnswers = () => {
  // For each answer, draw in its own canvas
  store.getters.answers.forEach((answer, index) => {
    const canvas = document.getElementById(`answerCanvas${index}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, answerCanvasSize.value, answerCanvasSize.value);

    // If puzzle is revealed, highlight correct & selected answers
    if (store.state.isAnswerRevealed) {
      // Always highlight the correct answer in a green outline
      if (index === store.getters.correctAnswerIndex) {
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#00cc00';
        ctx.strokeRect(2, 2, answerCanvasSize.value - 4, answerCanvasSize.value - 4);
        ctx.restore();
      }

      // Also highlight the user's selection:
      // - green outline if it's the correct answer
      // - red outline if it's the wrong one
      if (index === store.state.selectedAnswerIndex) {
        ctx.save();
        ctx.lineWidth = 5;
        if (store.getters.isAnswerCorrect) {
          // same as correct
          ctx.strokeStyle = '#00cc00';
        } else {
          // wrong guess
          ctx.strokeStyle = '#ff0000';
        }
        ctx.strokeRect(8, 8, answerCanvasSize.value - 16, answerCanvasSize.value - 16);
        ctx.restore();
      }
    }

    // Now draw the shape for this answer
    store.getters.drawCell(ctx, answer, 0, 0, answerCanvasSize.value);
  });
};

// Handle user clicks on an answer
const onAnswerClicked = (index) => {
  if (!store.state.isAnswerRevealed) {
    store.commit('selectAnswer', index);
  }
};

const updateSizes = () => {
  puzzleCanvasSize.value = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.5);
  answerCanvasSize.value = Math.round(puzzleCanvasSize.value * 0.2);
};

onMounted(() => {
  updateSizes();

  window.addEventListener('resize', () => {
    updateSizes();
    drawAll();
  });

  store.commit('generate');

  // Redraw whenever puzzle or reveal state changes
  watch(
      () => store.state.cellsAndAnswers,
      drawAll,
      { deep: true, immediate: true }
  );
  watch(
      () => store.state.isAnswerRevealed,
      drawAll,
      { immediate: true }
  );
});

onBeforeUnmount(() => {
  // Clean up listener to avoid leaks
  window.removeEventListener('resize', updateSizes);
});
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

    <div v-if="store.state.isAnswerRevealed" class="mt-4 text-center">
      <button class="btn btn-primary mt-4" @click="store.commit('generate')">
        Next Puzzle
      </button>
    </div>
  </div>
</template>

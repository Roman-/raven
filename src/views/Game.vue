<script setup>
import {onMounted, ref, watch, onBeforeUnmount, computed} from 'vue';
import { store } from '@/store/store';
import { drawPuzzleGrid } from '@/js/drawer';
import {randomElement} from "@/js/helpers";

// Main puzzle dimension
const puzzleCanvasSize = ref(500);
const puzzleCanvas = ref(null);

// Each answer's canvas dimension
const answerCanvasSize = ref(100);

// Watch the store's puzzle/answers to redraw
const drawAll = () => {
  drawPuzzle()
  drawAllAnswers()
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
      store.state.isAnswerRevealed ? 'r' : 'q'
  );
};

const drawAllAnswers = () => {
  // For each answer, draw in its own canvas
  store.getters.answers.forEach((answer, index) => {
    const canvas = document.getElementById(`answerCanvas${index}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, answerCanvasSize.value, answerCanvasSize.value);

    // Now draw the shape for this answer
    store.getters.drawCell(ctx, answer, 0, 0, answerCanvasSize.value);
  });
};

const onAnswerClicked = (index) => {
  if (!store.state.isAnswerRevealed) {
    store.commit('selectAnswer', index);
  }
};

const updateSizes = () => {
  puzzleCanvasSize.value = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.5);
  answerCanvasSize.value = Math.round(puzzleCanvasSize.value * 0.2);
};

const answerCanvasClass = (index) => {
  if (!store.state.isAnswerRevealed) {
    return 'border-gray-500 border-dashed';
  }

  const correctIndex = store.getters.correctAnswerIndex;
  const selectedIndex = store.state.selectedAnswerIndex;

  if (index === correctIndex) {
    return 'outline outline-green-500 outline-2 border-transparent';
  }

  if (index === selectedIndex && selectedIndex !== correctIndex) {
    return 'outline outline-red-500 outline-2 border-transparent';
  }

  return 'opacity-25 border-gray-300 border-dashed';
};

const dividerText = computed(() => {
  if (!store.state.isAnswerRevealed) {
    return 'which completes the pattern?';
  }
  if (store.getters.correctAnswerIndex === store.state.selectedAnswerIndex) {
    return randomElement(["nice!", "great!", "awesome!", "well done!", "keep it up!",
      "fantastic!", "brilliant!", "excellent!"])
  } else {
    return randomElement(["oops", "uh-oh", "nope", "nah", "ouch", "hmm", "meh", "whoops"])
  }
});

const dividerClass = computed(() => {
  return store.state.isAnswerRevealed && store.getters.correctAnswerIndex !== store.state.selectedAnswerIndex ? 'divider-error' : ''
})

onMounted(() => {
  updateSizes();

  window.addEventListener('resize', () => {
    updateSizes();
    setTimeout(drawAll, 1);
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

  // Draw on canvas on init (bug)
  setTimeout(drawAll, 1);
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
    />

    <div class="divider text-neutral-500 my-6" :class="dividerClass">{{dividerText}}</div>

    <div class="grid grid-cols-4 gap-2">
      <div
          v-for="(answer, index) in store.getters.answers"
          :key="index"
      >
        <canvas
            :id="`answerCanvas${index}`"
            :width="answerCanvasSize"
            :height="answerCanvasSize"
            @click="onAnswerClicked(index)"
            class="cursor-pointer border rounded-lg box-border"
            :class="answerCanvasClass(index)"
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

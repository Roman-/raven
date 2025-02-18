<script setup>
import { ref, onMounted } from 'vue'
import {downloadCanvasAsPNG, randomElement, shuffle} from '@/js/helpers'
import {generate2dGrid, generateThreeEmojis} from "@/js/generators";
import { fillWithPleasantGradient } from "@/js/drawers";

// ---------------------------------------------------
// 1. Dimensions & Basic Config
// ---------------------------------------------------
const margin = 100;    // top/left/bottom/right margin
const cellSize = 200;  // each grid cell
const gridRows = 3;
const gridCols = 3;
const imgNumber = ref(1)

const gridWidth = cellSize * gridCols;
const gridHeight = cellSize * gridRows;

// Final canvas dimension (width x height)
const canvasWidth = ref(gridWidth + margin * 2);
const canvasHeight = ref(canvasWidth.value + margin);

const myCanvas = ref(null);

// ---------------------------------------------------
// 3. Drawing
// ---------------------------------------------------

// Fill the whole canvas with the pleasant gradient:
function fillBackground(ctx) {
  // Pick the larger dimension so the gradient covers the entire area
  const biggerSide = Math.max(canvasWidth.value, canvasHeight.value);
  fillWithPleasantGradient(ctx, biggerSide);
}

// Draw the 3×3 puzzle grid with a question mark in bottom-right
function drawGrid(ctx, grid, emojis) {
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const x = margin + c * cellSize;
      const y = margin + r * cellSize;

      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellSize, cellSize);

      // question mark in bottom-right cell
      const isQuestion = (r === 2 && c === 2);
      if (isQuestion) {
        ctx.fillStyle = "#000";
        ctx.font = `${cellSize * 0.7}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("?", x + cellSize / 2, y + cellSize / 2);
      } else {
        const index = grid[r][c];
        const symbol = emojis[index];

        ctx.fillStyle = "#000";
        ctx.font = `${cellSize * 0.7}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbol, x + cellSize / 2, y + cellSize / 2);
      }
    }
  }
}

// Draw the 3 answers in dashed circles below the puzzle
function drawAnswers(ctx, answers) {
  const radius = 60;
  // puzzle bottom is margin + gridHeight => 100 + 600 = 700
  // place circles 80px below => centerY = 780
  const centerY = margin + gridHeight + 80; // 780
  const stepX = canvasWidth.value / 4;

  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  for (let i = 0; i < answers.length; i++) {
    const centerX = stepX * (i + 1);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Draw the emoji inside
    ctx.fillStyle = "#000";
    // Slightly adjusted to radius px for a comfortable size
    ctx.font = `${radius}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(answers[i], centerX, centerY);
  }

  // Reset dash
  ctx.setLineDash([]);
}

// ---------------------------------------------------
// 4. Main puzzle generation + rendering
// ---------------------------------------------------
let puzzleGrid;
let puzzleEmojis;

function drawPuzzle() {
  const ctx = myCanvas.value.getContext('2d');

  fillBackground(ctx);           // fill with the gradient
  drawGrid(ctx, puzzleGrid, puzzleEmojis);
  drawAnswers(ctx, puzzleEmojis);
}

// Generate random puzzle grid & emojis, then draw
function generateAndDraw() {
  puzzleGrid = generate2dGrid();
  puzzleEmojis = generateThreeEmojis(true);
  drawPuzzle();
}

// Initialize on mount
onMounted(() => {
  generateAndDraw();
});
</script>

<template>
  <div>
    <canvas ref="myCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>

    <div class="flex justify-center gap-2 mt-4">
      <button @click="downloadCanvasAsPNG(myCanvas, `puzzle${++imgNumber}.png`)" class="btn btn-neutral">Download Image</button>
      <button @click="generateAndDraw" class="btn  btn-neutral">
        Generate Next Image
      </button>
    </div>
  </div>
</template>

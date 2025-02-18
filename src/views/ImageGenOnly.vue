<script setup>
import { ref, onMounted } from 'vue'
import {downloadCanvasAsPNG, randomElement, shuffle} from '@/js/helpers'
import {generate2dGrid, generateThreeEmojis} from "@/js/generators";

// ---------------------------------------------------
// 1. Dimensions & Basic Config
// ---------------------------------------------------
const margin = 100;    // top/left/bottom/right margin
const cellSize = 200;  // each grid cell
const gridRows = 3;
const gridCols = 3;
const imgNumber = ref(1)

const gridWidth = cellSize * gridCols;    // 600
const gridHeight = cellSize * gridRows;   // 600

// Final canvas dimension (width x height)
const canvasWidth = ref(gridWidth + margin * 2); // 600 + 200 = 800
const canvasHeight = ref(880); // Enough space for answers below puzzle

const myCanvas = ref(null);

// ---------------------------------------------------
// 2. Gradient Background
// ---------------------------------------------------
// Provided snippet: fill the rectangle with a pleasant gradient in random direction
function fillWithPleasantGradient(ctx, canvasSize) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  let directions = [
    [0, 0, canvasSize, canvasSize], // diagonal (top-left to bottom-right)
    [canvasSize, 0, 0, canvasSize], // diagonal (top-right to bottom-left)
    [0, 0, 0, canvasSize], // vertical (left to right)
    [0, 0, canvasSize, 0], // horizontal (top to bottom)
    [canvasSize / 2, 0, canvasSize / 2, canvasSize], // centered vertical
    [0, canvasSize / 2, canvasSize, canvasSize / 2], // centered horizontal
  ];

  const d = randomElement(directions);
  const gradient = ctx.createLinearGradient(d[0], d[1], d[2], d[3]);

  const colors = shuffle(["#DCF1FF", "#F0E7FF", "#FFDCE1"]);

  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.5, colors[1]);
  gradient.addColorStop(1, colors[2]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasSize, canvasSize);
}

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
  <div style="max-width: 900px; margin: 0 auto; text-align: center;">
    <canvas ref="myCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>

    <div class="flex justify-center gap-2 mt-4">
      <button @click="downloadCanvasAsPNG(myCanvas, `puzzle${++imgNumber}.png`)" class="btn btn-neutral">Download Image</button>
      <button @click="generateAndDraw" class="btn  btn-neutral">
        Generate Next Image
      </button>
    </div>
  </div>
</template>

<template>
  <div style="max-width: 900px; margin: 0 auto; text-align: center;">
    <canvas ref="myCanvas" :width="canvasWidth" :height="canvasHeight"></canvas>

    <div style="margin-top: 20px;">
      <button @click="downloadImage" class="btn">Download Image</button>
      <button @click="generateAndDraw" class="btn" style="margin-left: 10px;">
        Generate Next Image
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { shuffle } from '@/js/helpers'
import {generate2dGrid, generateThreeEmojis} from "@/js/generators";

// ---------------------------------------------------
// 1. Dimensions & Basic Config
// ---------------------------------------------------
// We want a bigger canvas for printing without losing resolution.
// - 3 cells across & down, each cell = 200×200 => 600×600 puzzle
// - 100px margin on each side => total width = 800
// - After the puzzle, place answers with minimal gap => total height ~880
// Adjust these as you see fit.

const margin = 100;    // top/left/bottom/right margin
const cellSize = 200;  // each grid cell
const gridRows = 3;
const gridCols = 3;

const gridWidth = cellSize * gridCols;    // 600
const gridHeight = cellSize * gridRows;   // 600

// Final canvas dimension (width x height)
const canvasWidth = ref(gridWidth + margin * 2); // 600 + 200 = 800
// We'll place the answers a bit below the puzzle, leaving some bottom margin
const canvasHeight = ref(880); // Chosen to have a bit of space under answers

const myCanvas = ref(null);

// ---------------------------------------------------
// 3. Drawing
// ---------------------------------------------------

// Just fill with a white background (or do your gradient if you prefer).
function fillBackground(ctx) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
}

// Draw the 3×3 puzzle grid with a question mark in bottom-right
function drawGrid(ctx, grid, emojis) {
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      // Compute top-left of the cell
      const x = margin + c * cellSize;
      const y = margin + r * cellSize;

      // Cell outline
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellSize, cellSize);

      // If it's the bottom-right cell, draw question mark
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
  // We'll place them horizontally spaced in the bottom area.
  // Let's pick a radius bigger than before (diameter ~120).
  const radius = 60;

  // We'll place them ~80px below the puzzle's bottom edge
  // so puzzle bottom is margin + gridHeight = 100 + 600 = 700
  // circles' centerY = 700 + 80 = 780
  // That leaves 100 left to bottom of canvasHeight=880 => 20 px clearance
  const centerY = margin + gridHeight + 80; // 780

  // We have an 800px wide canvas. We'll space the 3 circles evenly.
  // 4 segments => centers at x=200, 400, 600
  const stepX = canvasWidth.value / 4;

  // Thin, dashed outline
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  for (let i = 0; i < answers.length; i++) {
    const centerX = stepX * (i + 1);

    // Draw dashed circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Draw the emoji inside
    ctx.fillStyle = "#000";
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

  fillBackground(ctx);
  drawGrid(ctx, puzzleGrid, puzzleEmojis);
  drawAnswers(ctx, puzzleEmojis);
}

function generateAndDraw() {
  puzzleGrid = generate2dGrid()
  puzzleEmojis = generateThreeEmojis(true);
  drawPuzzle();
}

// Download as PNG
function downloadImage() {
  const link = document.createElement('a');
  link.download = 'my_puzzle.png';
  link.href = myCanvas.value.toDataURL("image/png");
  link.click();
}

// Initialize on mount
onMounted(() => {
  generateAndDraw();
});
</script>

<style scoped>
.btn {
  padding: 10px 16px;
  font-size: 16px;
  background-color: #ccc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>

<template>
  <div style="max-width: 800px; margin: 0 auto; text-align: center;">
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

// IMPORTANT: we rely on your existing helpers, so we do NOT redefine them here
// E.g.: import { shuffle } from '@/js/helpers';
import { shuffle } from '@/js/helpers';

// ---------------------------------------------------
// 1. Basic config
// ---------------------------------------------------
const margin = 50;      // margin around the puzzle
const cellSize = 100;   // each cell is 100×100
const gridRows = 3;
const gridCols = 3;

const gridWidth = cellSize * gridCols;  // 300
const gridHeight = cellSize * gridRows; // 300

// We'll put the answers below the grid with some extra spacing
// so total canvas height is gridHeight + some extra
const answersSectionHeight = 150;
const canvasWidth = ref(gridWidth + margin * 2);    // 300 + 100 = 400
const canvasHeight = ref(gridHeight + margin * 2 + answersSectionHeight); // 300 + 100 + 150 = 550

const myCanvas = ref(null);

// ---------------------------------------------------
// 2. Data generation
//    a) A fixed 3×3 pattern with no repeats per row/col
//    b) Randomly pick 3 emojis, shuffle them for indices 0,1,2
// ---------------------------------------------------
function generateFixedGrid() {
  // A simple 3×3 Latin square: each row, col has unique indices
  return [
    [0, 1, 2],
    [2, 0, 1],
    [1, 2, 0]
  ];
}

function generateThreeEmojis() {
  // You can pick from a bigger pool if you want
  const emojiPool = ["🍎", "🍌", "🍇", "🍉", "🍑", "🍒", "🥑", "🌽", "🥕"];
  shuffle(emojiPool);       // from your helpers
  // Grab first 3
  return emojiPool.slice(0, 3);
}

// ---------------------------------------------------
// 3. Drawing
// ---------------------------------------------------

// A gentle gradient background
function fillBackground(ctx) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

  // If you want a simple color fill or your own gradient logic:
  // (This is a simpler approach, but you can still do your pleasant gradient if you like)
  //
  // // Example random gradient:
  // const rndCoord = () => Math.random() > 0.5 ? 0 : canvasWidth.value;
  // const gradient = ctx.createLinearGradient(rndCoord(), rndCoord(), rndCoord(), rndCoord());
  // gradient.addColorStop(0, "#DCF1FF");
  // gradient.addColorStop(0.5, "#F0E7FF");
  // gradient.addColorStop(1, "#FFDCE1");
  // ctx.fillStyle = gradient;
  // ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
}

// Draw the 3×3 puzzle
function drawGrid(ctx, grid, emojis) {
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      // Compute top-left of the cell
      const x = margin + c * cellSize;
      const y = margin + r * cellSize;

      // Draw the cell outline
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
        // The index in the emojis array
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

// Draw the 3 answers in dashed circles below the grid
function drawAnswers(ctx, answers) {
  // We'll place them in a row near the bottom of the canvas
  const radius = 30;
  const circleY = margin + gridHeight + 70; // some offset below the grid

  // Spread them horizontally across the canvas
  // (4 equal segments -> pick center points for 3 circles)
  const stepX = canvasWidth.value / 4;

  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]); // dashed line
  for (let i = 0; i < answers.length; i++) {
    const centerX = stepX * (i + 1);
    const centerY = circleY;

    // Draw dashed circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#000";
    ctx.stroke();

    // Draw the emoji smaller inside
    ctx.fillStyle = "#000";
    ctx.font = `${radius * 1.4}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(answers[i], centerX, centerY);
  }
  // Reset line dash
  ctx.setLineDash([]);
}

// ---------------------------------------------------
// 4. Main puzzle generation and rendering
// ---------------------------------------------------
let puzzleGrid;   // 3×3 array of indices
let puzzleEmojis; // array of 3 emojis

function drawPuzzle() {
  const ctx = myCanvas.value.getContext('2d');

  // 1) Fill background
  fillBackground(ctx);

  // 2) Draw the puzzle grid
  drawGrid(ctx, puzzleGrid, puzzleEmojis);

  // 3) Draw the answers at the bottom
  drawAnswers(ctx, puzzleEmojis);
}

function generateAndDraw() {
  // Fixed 3×3 pattern (no repeating item in any row/col)
  puzzleGrid = generateFixedGrid();
  // Shuffle and pick 3 emojis
  puzzleEmojis = generateThreeEmojis();
  // Render
  drawPuzzle();
}

function downloadImage() {
  const link = document.createElement('a');
  link.download = 'my_puzzle.png';
  link.href = myCanvas.value.toDataURL("image/png");
  link.click();
}

onMounted(() => {
  generateAndDraw();
});
</script>

<style scoped>
.btn {
  padding: 10px 16px;
  font-size: 16px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #ccc;
  border: none;
  border-radius: 4px;
}
</style>

<template>
  <div class="p-2">
    <!-- Main buttons row -->
    <div class="flex gap-2 flex-wrap mb-2">
      <button class="btn btn-primary" @click="generatePuzzle">Re-generate</button>
      <button class="btn btn-secondary" @click="downloadPng">Download PNG</button>
      <button class="btn btn-accent" @click="downloadTen">Download 10</button>
    </div>

    <!-- Wallpaper canvas -->
    <canvas
        ref="canvasRef"
        :width="wallpaperWidth"
        :height="wallpaperHeight"
        style="border:1px solid #444; max-width:100%;"
    />

    <!-- Settings -->
    <div class="mt-4 p-2 border border-gray-300 rounded">
      <h2 class="text-xl font-bold mb-2">Wallpaper Settings</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Canvas dimensions -->
        <div>
          <label class="block font-semibold mb-1">Canvas Width / Height</label>
          <div class="flex gap-2">
            <input
                type="number"
                class="input input-bordered w-24"
                v-model.number="wallpaperWidth"
                @input="drawWallpaper"
            />
            <input
                type="number"
                class="input input-bordered w-24"
                v-model.number="wallpaperHeight"
                @input="drawWallpaper"
            />
          </div>
        </div>

        <!-- Puzzle size ratio -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Size Ratio (fraction of height)</label>
          <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              v-model.number="puzzleSizeRatio"
              class="range"
              @input="drawWallpaper"
          />
          <p class="text-sm">Value: {{ puzzleSizeRatio }}</p>
        </div>

        <!-- Puzzle margin ratio -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Margin Ratio (fraction of puzzle size)</label>
          <input
              type="range"
              min="0"
              max="0.1"
              step="0.01"
              v-model.number="puzzleMarginRatio"
              class="range"
              @input="drawWallpaper"
          />
          <p class="text-sm">Value: {{ puzzleMarginRatio }}</p>
        </div>

        <!-- Answer Cell Size -->
        <div>
          <label class="block font-semibold mb-1">Answer Cell Size (px)</label>
          <input
              type="range"
              min="10"
              max="300"
              step="1"
              v-model.number="answerCellSize"
              class="range"
              @input="drawWallpaper"
          />
          <p class="text-sm">Value: {{ answerCellSize }}</p>
        </div>

        <!-- Answer Cell Gap -->
        <div>
          <label class="block font-semibold mb-1">Answer Cell Gap (px)</label>
          <input
              type="range"
              min="0"
              max="50"
              step="1"
              v-model.number="answerGap"
              class="range"
              @input="drawWallpaper"
          />
          <p class="text-sm">Value: {{ answerGap }}</p>
        </div>

        <!-- Border color -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Border Color</label>
          <input
              type="color"
              class="input input-bordered w-full"
              v-model="borderColor"
              @input="drawWallpaper"
          />
        </div>

        <!-- Border thickness -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Border Thickness (px)</label>
          <input
              type="range"
              min="0"
              max="10"
              step="1"
              v-model.number="borderThickness"
              class="range"
              @input="drawWallpaper"
          />
          <p class="text-sm">Value: {{ borderThickness }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { shapeFlavor } from '@/js/puzzle_flavors/shapeFlavor'
import { drawPuzzleGrid } from '@/js/drawer'
import { generateCellsAndAnswers } from '@/js/generator'
import { generateSetOfGridsMaximumDifficulty } from '@/js/grids'
import { downloadCanvasAsPNG, randomElement, seededRandom } from '@/js/helpers'
import { drawRandomLinearGradient } from '@/js/draw/drawingCommon'

const flavor = shapeFlavor;

// User settings
const wallpaperWidth    = ref(1920);
const wallpaperHeight   = ref(1080);
const puzzleSizeRatio   = ref(0.7);
const puzzleMarginRatio = ref(0.02);
const answerCellSize    = ref(100);
const answerGap         = ref(10);
const borderColor       = ref('#ffffff55');
const borderThickness   = ref(2);

const puzzleData = ref(null);
let lastSeedUsed = 999;
const canvasRef = ref(null);

// Generate new puzzle
function generatePuzzle() {
  lastSeedUsed += 17 + Math.floor(Math.random() * 50);
  const numFeatures = Object.keys(flavor.getFeaturesVariations()).length;
  const grids = generateSetOfGridsMaximumDifficulty(numFeatures);
  puzzleData.value = generateCellsAndAnswers(grids, flavor, 9);
  drawWallpaper();
}

// Draw the entire wallpaper
function drawWallpaper() {
  const canvas = canvasRef.value;
  if (!canvas || !puzzleData.value) return;

  canvas.width  = wallpaperWidth.value;
  canvas.height = wallpaperHeight.value;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background gradient
  const palettes = [
    ["#1A1A1D", "#3B1C32", "#6A1E55"],
    ["#09122C", "#872341", "#BE3144"],
    ["#1A3636", "#40534C", "#677D6A"],
    ["#1B262C", "#0F4C75", "#3282B8"],
    ["#17153B", "#2E236C", "#433D8B"]
  ];
  const chosenPalette = randomElement(palettes);
  drawRandomLinearGradient(ctx, 0, 0, canvas.width, canvas.height, chosenPalette);

  // Puzzle placement
  const puzzleSize = canvas.height * puzzleSizeRatio.value;
  const puzzleX = (canvas.width - puzzleSize) / 2;
  const puzzleY = (canvas.height - puzzleSize) / 2;
  const margin = puzzleSize * puzzleMarginRatio.value;

  // Semi-transparent box behind puzzle
  ctx.fillStyle = borderColor.value;
  ctx.fillRect(
      puzzleX - margin,
      puzzleY - margin,
      puzzleSize + margin * 2,
      puzzleSize + margin * 2
  );

  // Draw puzzle (3x3)
  drawPuzzleGrid(
      ctx,
      puzzleX,
      puzzleY,
      puzzleSize,
      puzzleData.value.cells,
      flavor.drawCell,
      lastSeedUsed,
      'q',
      borderColor.value.replace('#','')
  );

  // Optional border around puzzle
  if (borderThickness.value > 0) {
    ctx.save();
    ctx.strokeStyle = borderColor.value;
    ctx.lineWidth = borderThickness.value;
    ctx.strokeRect(
        puzzleX - margin,
        puzzleY - margin,
        puzzleSize + margin * 2,
        puzzleSize + margin * 2
    );
    ctx.restore();
  }

  // Draw answer row
  drawAnswersRow(ctx, puzzleData.value.answers);
}

// Draw answers at the bottom
function drawAnswersRow(ctx, answers) {
  if (!answers || !answers.length) return;
  const totalWidth = answers.length * answerCellSize.value + (answers.length - 1) * answerGap.value;
  const startX = (ctx.canvas.width - totalWidth) / 2;
  const y = ctx.canvas.height - answerCellSize.value - 50;

  for (let i = 0; i < answers.length; i++) {
    const cellX = startX + i * (answerCellSize.value + answerGap.value);
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(cellX, y, answerCellSize.value, answerCellSize.value);
    ctx.restore();

    const offscreen = document.createElement('canvas');
    offscreen.width = answerCellSize.value;
    offscreen.height = answerCellSize.value;
    const offctx = offscreen.getContext('2d');
    const rand = seededRandom(lastSeedUsed + i);

    flavor.drawCell(offctx, answers[i], answerCellSize.value, rand);
    ctx.drawImage(offscreen, cellX, y);
  }
}

// Download a single PNG
function downloadPng() {
  downloadCanvasAsPNG(canvasRef.value, "wallpaper.png");
}

// Generate & download 10 wallpapers
function downloadTen() {
  const oldPuzzle = puzzleData.value;
  for (let i = 1; i <= 10; i++) {
    generatePuzzle();
    downloadCanvasAsPNG(canvasRef.value, `wallpaper_${i}.png`);
  }
  puzzleData.value = oldPuzzle;
  drawWallpaper();
}

// On mount, generate once
onMounted(() => {
  generatePuzzle();
});
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: auto;
  background-color: #222;
}
</style>

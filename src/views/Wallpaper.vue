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
      <h2 class="text-xl font-bold mb-4">Wallpaper Settings</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Canvas dimensions via select -->
        <div>
          <label class="block font-semibold mb-1">Canvas Dimensions</label>
          <select class="select select-bordered" v-model="selectedDimensions" @change="onDimensionsChanged">
            <!-- Common desktop resolutions -->
            <option value="1920x1080">1920 x 1080 (Full HD)</option>
            <option value="2560x1440">2560 x 1440 (QHD)</option>
            <option value="1280x720">1280 x 720 (HD)</option>
            <!-- Common phone resolutions -->
            <option value="1080x1920">1080 x 1920 (FHD Portrait)</option>
            <option value="720x1280">720 x 1280 (HD Portrait)</option>
            <option value="1440x2560">1440 x 2560 (QHD Portrait)</option>
          </select>
          <p class="text-sm mt-1">Currently: {{ wallpaperWidth }} x {{ wallpaperHeight }}</p>
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
              max="0.3"
              step="0.01"
              v-model.number="puzzleMarginRatio"
              class="range"
              @input="drawWallpaper"
          />
          <p class="text-sm">Value: {{ puzzleMarginRatio }}</p>
        </div>

        <!-- Grid Y offset -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Y Offset (px)</label>
          <input
              type="range"
              min="-300"
              max="300"
              step="1"
              v-model.number="gridYOffset"
              class="range"
              @input="drawWallpaper"
          />
          <p class="text-sm">Value: {{ gridYOffset }}</p>
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
          <label class="block font-semibold mt-2">Border Alpha</label>
          <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              v-model.number="borderAlpha"
              class="range"
              @input="drawWallpaper"
          />
          <p class="text-sm">Alpha: {{ borderAlpha }}</p>
        </div>

        <!-- Border thickness -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Border Thickness (px)</label>
          <input
              type="number"
              min="0"
              class="input input-bordered w-24"
              v-model.number="borderThickness"
              @input="drawWallpaper"
          />
          <p class="text-sm">Value: {{ borderThickness }}</p>

          <label class="block font-semibold mt-2">Border Roundness (px)</label>
          <input
              type="range"
              min="0"
              max="100"
              step="1"
              v-model.number="borderRadius"
              class="range"
              @input="drawWallpaper"
          />
          <p class="text-sm">Value: {{ borderRadius }}</p>
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

/** Flavor used for demonstration; replace with your desired flavor if needed. */
const flavor = shapeFlavor;

/** Conversion helper: hex + alpha -> rgba(...) string */
function hexToRgba(hex, alpha) {
  const trimmed = hex.replace(/^#/, '');
  let r = parseInt(trimmed.substring(0, 2), 16);
  let g = parseInt(trimmed.substring(2, 4), 16);
  let b = parseInt(trimmed.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    // Fallback to white if invalid
    return `rgba(255,255,255,${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Draw a rounded rectangle path */
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Settings
const selectedDimensions  = ref("1920x1080");
const wallpaperWidth      = ref(1920);
const wallpaperHeight     = ref(1080);
const puzzleSizeRatio     = ref(0.7);
const puzzleMarginRatio   = ref(0.02);
const gridYOffset         = ref(0);      // new range to shift puzzle vertically
const answerCellSize      = ref(100);
const answerGap           = ref(10);
const borderColor         = ref('#ffffff');
const borderAlpha         = ref(0.33);   // default alpha
const borderThickness     = ref(2);
const borderRadius        = ref(0);

const puzzleData          = ref(null);
let lastSeedUsed          = 999;
const canvasRef           = ref(null);

/** Parse selected <select> value, update width/height, re-draw. */
function onDimensionsChanged() {
  const [w, h] = selectedDimensions.value.split('x').map(Number);
  wallpaperWidth.value  = w;
  wallpaperHeight.value = h;
  drawWallpaper();
}

/** Generate a puzzle. */
function generatePuzzle() {
  lastSeedUsed += 17 + Math.floor(Math.random() * 50);
  const numFeatures = Object.keys(flavor.getFeaturesVariations()).length;
  const grids = generateSetOfGridsMaximumDifficulty(numFeatures);
  puzzleData.value = generateCellsAndAnswers(grids, flavor, 9);
  drawWallpaper();
}

/** Main draw method. */
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

  // Puzzle size and placement
  const puzzleSize = canvas.height * puzzleSizeRatio.value;
  const puzzleX = (canvas.width - puzzleSize) / 2;
  const puzzleY = ((canvas.height - puzzleSize) / 2) + gridYOffset.value;
  const margin = puzzleSize * puzzleMarginRatio.value;

  // Semi-transparent rounded box behind puzzle
  ctx.fillStyle = hexToRgba(borderColor.value, borderAlpha.value);
  drawRoundedRect(ctx, puzzleX - margin, puzzleY - margin, puzzleSize + margin * 2, puzzleSize + margin * 2, borderRadius.value);
  ctx.fill();

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
      // the puzzle's internal lines use partial alpha (#COLOR33 or #COLOR55)
      borderColor.value.replace('#','')
  );

  // Optional border stroke around that rounded region
  if (borderThickness.value > 0) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(borderColor.value, borderAlpha.value);
    ctx.lineWidth = borderThickness.value;
    drawRoundedRect(ctx, puzzleX - margin, puzzleY - margin, puzzleSize + margin * 2, puzzleSize + margin * 2, borderRadius.value);
    ctx.stroke();
    ctx.restore();
  }

  // Draw answers row
  drawAnswersRow(ctx, puzzleData.value.answers);
}

/** Draw the row of answers at the bottom. */
function drawAnswersRow(ctx, answers) {
  if (!answers || !answers.length) return;
  const totalWidth = answers.length * answerCellSize.value + (answers.length - 1) * answerGap.value;
  const startX = (ctx.canvas.width - totalWidth) / 2;
  const y = ctx.canvas.height - answerCellSize.value - 50; // near bottom

  for (let i = 0; i < answers.length; i++) {
    const cellX = startX + i * (answerCellSize.value + answerGap.value);

    // Light bounding box
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

/** Download single PNG. */
function downloadPng() {
  downloadCanvasAsPNG(canvasRef.value, "wallpaper.png");
}

/** Generate & download 10 wallpapers */
function downloadTen() {
  const oldPuzzle = puzzleData.value;
  for (let i = 1; i <= 10; i++) {
    generatePuzzle();
    downloadCanvasAsPNG(canvasRef.value, `wallpaper_${i}.png`);
  }
  puzzleData.value = oldPuzzle;
  drawWallpaper();
}

/** On mount, generate one puzzle by default. */
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

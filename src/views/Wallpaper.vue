<template>
  <div class="p-2">
    <!-- 1) The main buttons row -->
    <div class="flex gap-2 flex-wrap mb-2">
      <button class="btn btn-primary" @click="generatePuzzle">Re-generate</button>
      <button class="btn btn-secondary" @click="downloadPng">Download PNG</button>
      <button class="btn btn-accent" @click="downloadTen">Download 10</button>
    </div>

    <!-- 2) Our wallpaper canvas -->
    <canvas
        ref="canvasRef"
        :width="wallpaperWidth"
        :height="wallpaperHeight"
        style="border:1px solid #444; max-width:100%;"
    />

    <!-- 3) Settings for the wallpaper -->
    <div class="mt-4 p-2 border border-gray-300 rounded">
      <h2 class="text-xl font-bold mb-2">Wallpaper Settings</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <!-- Canvas dimensions -->
        <div>
          <label class="block font-semibold mb-1">Canvas Width / Height</label>
          <div class="flex gap-2">
            <input type="number" class="input input-bordered w-24" v-model.number="wallpaperWidth" />
            <input type="number" class="input input-bordered w-24" v-model.number="wallpaperHeight" />
          </div>
        </div>

        <!-- Puzzle size ratio -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Size Ratio (fraction of height)</label>
          <input type="range" min="0.1" max="1" step="0.05" v-model.number="puzzleSizeRatio" class="range" />
          <p class="text-sm">Value: {{ puzzleSizeRatio }}</p>
        </div>

        <!-- Puzzle margin ratio -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Margin Ratio (fraction of puzzle size)</label>
          <input type="range" min="0" max="0.1" step="0.01" v-model.number="puzzleMarginRatio" class="range" />
          <p class="text-sm">Value: {{ puzzleMarginRatio }}</p>
        </div>

        <!-- Answer row: cell size & gap -->
        <div>
          <label class="block font-semibold mb-1">Answer Cell Size (px)</label>
          <input type="number" class="input input-bordered w-24" v-model.number="answerCellSize" />
        </div>

        <div>
          <label class="block font-semibold mb-1">Answer Cell Gap (px)</label>
          <input type="number" class="input input-bordered w-24" v-model.number="answerGap" />
        </div>

        <!-- Border color & thickness -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Border Color (#hex)</label>
          <input type="text" class="input input-bordered w-full" v-model="borderColor" />
        </div>
        <div>
          <label class="block font-semibold mb-1">Puzzle Border Thickness (px)</label>
          <input type="number" class="input input-bordered w-24" v-model.number="borderThickness" />
        </div>
      </div>

      <div class="mt-2">
        <button class="btn btn-outline" @click="onSettingsChanged">
          Apply Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { shapeFlavor } from '@/js/puzzle_flavors/shapeFlavor'

const flavor = shapeFlavor;
// You can import other flavors similarly...

import { drawPuzzleGrid } from '@/js/drawer'
import { generateCellsAndAnswers } from '@/js/generator'
import { generateSetOfGridsMaximumDifficulty } from '@/js/grids'
import { downloadCanvasAsPNG, randomElement, seededRandom } from '@/js/helpers'
import { drawRandomLinearGradient } from '@/js/draw/drawingCommon'

/** 2) Reactive state for user settings. */
const selectedFlavorName   = ref(flavor.name);
const wallpaperWidth       = ref(1920);
const wallpaperHeight      = ref(1080);
const puzzleSizeRatio      = ref(0.7);
const puzzleMarginRatio    = ref(0.02);
const answerCellSize       = ref(100);
const answerGap            = ref(10);
const borderColor          = ref('#ffffff55');
const borderThickness      = ref(2);

// The puzzle data after generation
const puzzleData = ref(null);

// We'll keep track of a numeric seed
let lastSeedUsed = 999;

/** 4) The main generate function. */
function generatePuzzle() {
  // increment or randomize seed
  lastSeedUsed += 17 + Math.floor(Math.random() * 50);

  // How many features does the selected flavor define?
  const numFeatures = Object.keys(flavor.getFeaturesVariations()).length;

  // Use maximum difficulty with that many features
  const grids = generateSetOfGridsMaximumDifficulty(numFeatures);

  // Generate puzzle with up to 9 answers (or however many you want)
  puzzleData.value = generateCellsAndAnswers(grids, flavor, 9);

  drawWallpaper();
}

/** 5) Draw everything. */
function drawWallpaper() {
  const canvas = canvasRef.value;
  if (!canvas || !puzzleData.value) return;

  // In case user has changed the canvas dimension:
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

  // optional semi-transparent box behind puzzle
  ctx.fillStyle = borderColor.value;
  ctx.fillRect(
      puzzleX - margin,
      puzzleY - margin,
      puzzleSize + margin * 2,
      puzzleSize + margin * 2
  );

  // Draw the 3x3 puzzle with question style
  drawPuzzleGrid(
      ctx,
      puzzleX,
      puzzleY,
      puzzleSize,
      puzzleData.value.cells,
      flavor.drawCell,
      lastSeedUsed,  // numeric seed
      'q',           // show question marks for answer cell
      borderColor.value.replace('#','') // stroke shade
  );

  // Optional border around puzzle region
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

/** 6) Draw the answer row at bottom. */
function drawAnswersRow(ctx, answers) {
  if (!answers || answers.length === 0) return;

  const totalWidth = answers.length * answerCellSize.value + (answers.length - 1) * answerGap.value;
  const startX = (ctx.canvas.width - totalWidth) / 2;
  const y = ctx.canvas.height - answerCellSize.value - 50;

  for (let i = 0; i < answers.length; i++) {
    const cellX = startX + i * (answerCellSize.value + answerGap.value);

    // Light bounding box
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(cellX, y, answerCellSize.value, answerCellSize.value);
    ctx.restore();

    // Offscreen canvas so we can draw at (0,0) inside it
    const offscreen = document.createElement('canvas');
    offscreen.width = answerCellSize.value;
    offscreen.height = answerCellSize.value;
    const offctx = offscreen.getContext('2d');

    // Provide a seeded random, if your flavor needs it
    const rand = seededRandom(lastSeedUsed + i);

    flavor.drawCell(offctx, answers[i], answerCellSize.value, rand);

    // Then copy onto main canvas at (cellX, y)
    ctx.drawImage(offscreen, cellX, y);
  }
}

/** 7) Download single PNG */
function downloadPng() {
  downloadCanvasAsPNG(canvasRef.value, "wallpaper.png");
}

/** 8) Generate & download 10 wallpapers */
function downloadTen() {
  const oldPuzzle = puzzleData.value;
  for (let i = 1; i <= 10; i++) {
    generatePuzzle();
    downloadCanvasAsPNG(canvasRef.value, `wallpaper_${i}.png`);
  }
  puzzleData.value = oldPuzzle;
  drawWallpaper();
}

/** 9) If user changes settings, re-draw */
function onSettingsChanged() {
  drawWallpaper();
}

/** 10) Startup: generate once */
const canvasRef = ref(null);
onMounted(() => {
  generatePuzzle();
});
</script>

<style scoped>
/* Just an example. The canvas can have a max width but keep the internal resolution. */
canvas {
  max-width: 100%;
  height: auto;
  background-color: #222;
}
</style>

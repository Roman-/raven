<template>
  <div class="p-2">
    <!-- The canvas is 1920x1080 in internal resolution.
         Use CSS to display smaller, but keep full resolution for downloads. -->
    <canvas
        ref="canvasRef"
        width="1920"
        height="1080"
    >
    </canvas>

    <div class="mt-2 flex gap-2 flex-wrap">
      <button class="btn btn-primary" @click="generatePuzzle">
        Re-generate
      </button>
      <button class="btn btn-secondary" @click="downloadPng">
        Download PNG
      </button>
      <button class="btn btn-accent" @click="downloadTen">
        Download 10
      </button>
      <button class="btn" @click="openSettings">
        Settings
      </button>
    </div>

    <!-- A simple settings modal / dialog for adjusting our wallpaper. -->
    <dialog ref="settingsDialog" class="modal">
      <form method="dialog" class="modal-box space-y-3 max-w-xl">
        <h3 class="font-bold text-lg">Wallpaper Settings</h3>

        <!-- Flavor selection -->
        <div>
          <label class="block font-semibold mb-1">Flavor:</label>
          <select v-model="selectedFlavorName" class="select select-bordered w-full">
            <option
                v-for="fl in allPossibleFlavors"
                :key="fl.name"
                :value="fl.name"
            >
              {{ fl.name }}
            </option>
          </select>
        </div>

        <!-- Puzzle size ratio -->
        <div>
          <label class="block font-semibold mb-1">
            Puzzle Size (fraction of canvas height):
          </label>
          <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              v-model.number="puzzleSizeRatio"
              class="range"
          />
          <p class="text-sm">Value: {{ puzzleSizeRatio }}</p>
        </div>

        <!-- Puzzle margin under it, just for demonstration -->
        <div>
          <label class="block font-semibold mb-1">
            Puzzle Margin (fraction of puzzle size):
          </label>
          <input
              type="range"
              min="0"
              max="0.1"
              step="0.01"
              v-model.number="puzzleMarginRatio"
              class="range"
          />
          <p class="text-sm">Value: {{ puzzleMarginRatio }}</p>
        </div>

        <!-- Answers row cell size, margin, etc. -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-semibold mb-1">Answer cell size:</label>
            <input
                type="number"
                v-model.number="answerCellSize"
                class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="block font-semibold mb-1">Answer cell gap:</label>
            <input
                type="number"
                v-model.number="answerGap"
                class="input input-bordered w-full"
            />
          </div>
        </div>

        <!-- Puzzle border color & thickness -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-semibold mb-1">Border color (#hex):</label>
            <input
                type="text"
                v-model="borderColor"
                class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="block font-semibold mb-1">Border thickness (px):</label>
            <input
                type="number"
                v-model.number="borderThickness"
                class="input input-bordered w-full"
            />
          </div>
        </div>

        <div class="modal-action">
          <button class="btn" @click="closeSettings">Close</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// Example flavors you might have:
import { shapeFlavor } from "@/js/puzzle_flavors/shapeFlavor.js"
import { multiShapeFlavor } from "@/js/puzzle_flavors/multiShapeFlavor"
import { emojiFlavor } from "@/js/puzzle_flavors/emojiFlavor"
import { drawPuzzleGrid } from "@/js/drawer"
import { generateSetOfGridsMaximumDifficulty } from "@/js/grids"
import { generateCellsAndAnswers } from "@/js/generator"
import { downloadCanvasAsPNG, randomElement, seededRandom } from "@/js/helpers"
import { drawRandomLinearGradient } from "@/js/draw/drawingCommon"

// We will create a list of flavors for the user to pick from:
const allPossibleFlavors = [
  shapeFlavor,
  multiShapeFlavor,
  emojiFlavor,
  // etc...
];

// Reactive references for settings
const selectedFlavorName = ref(shapeFlavor.name);   // default
const puzzleSizeRatio    = ref(0.7);                // portion of canvas height
const puzzleMarginRatio  = ref(0.02);               // fraction of puzzle size
const borderColor        = ref("#ffffff55");
const borderThickness    = ref(2);
const answerCellSize     = ref(100);
const answerGap          = ref(10);

const canvasRef = ref(null)
const puzzleData = ref(null)

// For random seeds:
let lastSeedUsed = 1000;

// We pick flavor by name:
const selectedFlavor = computed(() => {
  return allPossibleFlavors.find(fl => fl.name === selectedFlavorName.value) || shapeFlavor;
});

function generatePuzzle() {
  // We'll keep the random seed approach simple:
  lastSeedUsed += Math.floor(Math.random() * 1000);

  // Suppose we want to vary *all* features in the selected flavor
  const numFeatures = Object.keys(selectedFlavor.value.getFeaturesVariations()).length;

  // Generate grids for maximum difficulty using the number of features:
  const grids = generateSetOfGridsMaximumDifficulty(numFeatures);

  // Generate puzzle data
  puzzleData.value = generateCellsAndAnswers(grids, selectedFlavor.value, 9);
  drawWallpaper();
}

function drawWallpaper() {
  const canvas = canvasRef.value;
  if (!canvas || !puzzleData.value) return;

  const ctx = canvas.getContext('2d');

  // Draw background gradient
  const palettes = [
    ["#1A1A1D", "#3B1C32", "#6A1E55"],
    ["#09122C", "#872341", "#BE3144"],
    ["#1A3636", "#40534C", "#677D6A"],
    ["#1B262C", "#0F4C75", "#3282B8"],
    ["#17153B", "#2E236C", "#433D8B"]
  ];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const chosenPalette = randomElement(palettes);
  drawRandomLinearGradient(ctx, 0, 0, canvas.width, canvas.height, chosenPalette);

  // Puzzle in center:
  const puzzleSize = canvas.height * puzzleSizeRatio.value;
  const puzzleX = (canvas.width - puzzleSize) / 2;
  // You can shift it up or down as you see fit; here we just center vertically:
  const puzzleY = (canvas.height - puzzleSize) / 2;

  // optional background rectangle under puzzle
  const margin = puzzleSize * puzzleMarginRatio.value;
  ctx.fillStyle = borderColor.value; // with alpha
  ctx.fillRect(puzzleX - margin, puzzleY - margin, puzzleSize + margin * 2, puzzleSize + margin * 2);

  // Actually draw the 3x3 puzzle:
  drawPuzzleGrid(
      ctx,
      puzzleX,
      puzzleY,
      puzzleSize,
      puzzleData.value.cells,
      selectedFlavor.value.drawCell,
      lastSeedUsed,  // a valid numeric seed
      'q',           // question style (so answer cell is replaced with "?")
      borderColor.value.replace('#','')  // strokeShade, e.g. "ffffff55"
  );

  // We can add a bolder border around the entire puzzle, if we want:
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

  // Now draw the answers row
  drawAnswersRow(ctx, puzzleData.value.answers);
}

function drawAnswersRow(ctx, answers) {
  if (!answers || answers.length === 0) return;

  const totalWidth = answers.length * answerCellSize.value + (answers.length - 1) * answerGap.value;
  const startX = (ctx.canvas.width - totalWidth) / 2;
  const y = ctx.canvas.height - answerCellSize.value - 50; // place near bottom

  // We'll do an offscreen approach (like the puzzle code) so that shapeFlavor
  // can remain the same signature (ctx, cell, size, rand).
  for (let i = 0; i < answers.length; i++) {
    // bounding box for each cell
    const cellX = startX + i * (answerCellSize.value + answerGap.value);

    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(cellX, y, answerCellSize.value, answerCellSize.value);
    ctx.restore();

    // draw the shape offscreen
    const offscreen = document.createElement('canvas');
    offscreen.width = answerCellSize.value;
    offscreen.height = answerCellSize.value;
    const offctx = offscreen.getContext('2d');

    // Here we pass in a seeded random if needed
    const rand = seededRandom(lastSeedUsed + i);

    selectedFlavor.value.drawCell(offctx, answers[i], answerCellSize.value, rand);

    // Copy onto the main canvas
    ctx.drawImage(offscreen, cellX, y);
  }
}

// Download single PNG
function downloadPng() {
  downloadCanvasAsPNG(canvasRef.value, "wallpaper.png");
}

// Generate & download 10 wallpapers
function downloadTen() {
  // Save old puzzle
  const oldPuzzle = puzzleData.value;

  for (let i = 1; i <= 10; i++) {
    generatePuzzle();
    downloadCanvasAsPNG(canvasRef.value, `wallpaper_${i}.png`);
  }

  // Restore old puzzle
  puzzleData.value = oldPuzzle;
  drawWallpaper();
}

// Some utility for opening / closing the settings dialog
const settingsDialog = ref(null);

function openSettings() {
  settingsDialog.value?.showModal();
}

function closeSettings() {
  settingsDialog.value?.close();
  // Redraw after changes
  drawWallpaper();
}

onMounted(() => {
  generatePuzzle();
});
</script>

<style scoped>
canvas {
  width: 960px;
  height: 540px;
  border: 1px solid #444;
}
</style>

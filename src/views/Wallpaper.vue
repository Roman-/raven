<script setup>
import { ref, onMounted } from 'vue'
import { drawPuzzleGrid } from '@/js/drawer'
import { generateCellsAndAnswers } from '@/js/generator'
import {
  generateAlignedGrid,
  generateConstantGrid,
  generatePermutedGrid,
  generateSetOfGridsMaximumDifficulty
} from '@/js/grids'
import {downloadCanvasAsPNG, randomElement, seededRandom, shuffle} from '@/js/helpers'
import { drawRandomLinearGradient } from '@/js/draw/drawingCommon'
import {gridOfShapesFlavor} from "@/js/puzzle_flavors/gridOfShapesFlavor";

/******************************************************************************
 Flavor choosen for the wallpaper
 ******************************************************************************/
const flavor = gridOfShapesFlavor

/** Simple helper to convert #RRGGBB + alpha -> rgba(...) */
function hexToRgba(hex, alpha) {
  const trimmed = hex.replace(/^#/, '')
  const r = parseInt(trimmed.substring(0, 2), 16)
  const g = parseInt(trimmed.substring(2, 4), 16)
  const b = parseInt(trimmed.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(255,255,255,${alpha})`
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Draw a rounded rectangle path for custom roundness. */
function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, Math.min(w, h) / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/** Reactive state for user settings. */
const selectedDimensions   = ref('1920x1080')
const wallpaperWidth       = ref(1920)
const wallpaperHeight      = ref(1080)
const puzzleSizeRatio      = ref(0.7)           // default changed
const puzzleMarginRatio    = ref(0.06)          // default changed
const gridYOffsetRatio     = ref(-0.045)
const answerCellSize       = ref(100)
const answerGap            = ref(20)
const answerCellRadiusRatio = ref(0.16)         // relative to cell size
const borderColor          = ref('#ffffff')
const borderAlpha          = ref(0.4)
const borderRadiusRatio    = ref(0.04)          // relative to puzzle size
const numWallpapers        = ref(10)            // bulk‑download count

/** Puzzle data and references. */
const puzzleData  = ref(null)
const canvasRef   = ref(null)
let lastSeedUsed  = 999

/** Update width/height from <select> and redraw. */
function onDimensionsChanged() {
  const [w, h] = selectedDimensions.value.split('x').map(Number)
  wallpaperWidth.value  = w
  wallpaperHeight.value = h
  drawWallpaper()
}

function generatePuzzle() {
  lastSeedUsed += 17 + Math.floor(Math.random() * 50)
  // generate difficulty = 2
  const numFeatures = Object.keys(flavor.getFeaturesVariations()).length
  let grids = [generatePermutedGrid(), generateAlignedGrid()] // difficulty = 2
  // let grids = [generatePermutedGrid(1), generateAlignedGrid(0)] // for harder puzzles
  while (grids.length < numFeatures) {
    grids.push(generateConstantGrid()) // random constant from the rest of the feature to add variety
  }
  const numAnswers  = 9
  puzzleData.value  = generateCellsAndAnswers(grids, flavor, numAnswers, false)
  drawWallpaper()
}

/** Draw the entire wallpaper. */
function drawWallpaper() {
  const canvas = canvasRef.value
  if (!canvas || !puzzleData.value) return

  canvas.width  = wallpaperWidth.value
  canvas.height = wallpaperHeight.value

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  /* ---------- Background gradient ---------- */
  const palettes = [
    ['#1A1A1D', '#3B1C32', '#6A1E55'],
    ['#09122C', '#872341', '#BE3144'],
    ['#1A3636', '#40534C', '#677D6A'],
    ['#1B262C', '#0F4C75', '#3282B8'],
    ['#17153B', '#2E236C', '#433D8B']
  ]
  const chosenPalette = randomElement(palettes)
  drawRandomLinearGradient(ctx, 0, 0, canvas.width, canvas.height, chosenPalette)

  /* ---------- Puzzle layout ---------- */
  const puzzleSize = canvas.height * puzzleSizeRatio.value
  const margin     = puzzleSize * puzzleMarginRatio.value
  const puzzleX    = (canvas.width - puzzleSize) / 2
  const puzzleY    = ((canvas.height - puzzleSize) / 2) + (gridYOffsetRatio.value * canvas.height)

  /* Rounded box behind puzzle */
  ctx.fillStyle = hexToRgba(borderColor.value, borderAlpha.value)
  drawRoundedRect(
      ctx,
      puzzleX - margin,
      puzzleY - margin,
      puzzleSize + margin * 2,
      puzzleSize + margin * 2,
      puzzleSize * borderRadiusRatio.value
  )
  ctx.fill()

  /* Draw puzzle */
  drawPuzzleGrid(
      ctx,
      puzzleX,
      puzzleY,
      puzzleSize,
      puzzleData.value.cells,
      flavor.drawCell,
      lastSeedUsed,
      'q',
  )

  /* Draw answers row */
  drawAnswersRow(ctx, puzzleData.value.answers)
}

/** Draw the answers at the bottom with rounded corners. */
function drawAnswersRow(ctx, answers) {
  if (!answers || !answers.length) return

  const totalWidth = answers.length * answerCellSize.value + (answers.length - 1) * answerGap.value
  const startX     = (ctx.canvas.width - totalWidth) / 2
  const y          = ctx.canvas.height - answerCellSize.value - 50

  for (let i = 0; i < answers.length; i++) {
    const cellX = startX + i * (answerCellSize.value + answerGap.value)

    /* Rounded bounding box behind each answer */
    ctx.save()
    ctx.fillStyle = `rgba(255,255,255,${borderAlpha.value})`
    drawRoundedRect(
        ctx,
        cellX,
        y,
        answerCellSize.value,
        answerCellSize.value,
        answerCellSize.value * answerCellRadiusRatio.value
    )
    ctx.fill()
    ctx.restore()

    /* Draw the actual cell shape on an off‑screen canvas */
    const offscreen       = document.createElement('canvas')
    offscreen.width       = answerCellSize.value
    offscreen.height      = answerCellSize.value
    const offctx          = offscreen.getContext('2d')
    const rand            = seededRandom(lastSeedUsed + i)

    flavor.drawCell(offctx, answers[i], answerCellSize.value, rand)
    ctx.drawImage(offscreen, cellX, y)
  }
}

/** Download current PNG. */
function downloadPng() {
  downloadCanvasAsPNG(canvasRef.value, 'wallpaper.png')
}

/** Download a bulk set of wallpapers. */
function downloadBulk() {
  const oldPuzzle      = puzzleData.value
  const count          = Math.max(1, Math.min(100, Math.floor(numWallpapers.value || 1)))

  for (let i = 1; i <= count; i++) {
    generatePuzzle()
    const filename = `wallpaper_${String(i).padStart(3, '0')}.png`
    downloadCanvasAsPNG(canvasRef.value, filename)
  }

  puzzleData.value = oldPuzzle
  drawWallpaper()
}

onMounted(() => {
  generatePuzzle()
})
</script>
<template>
  <div class="p-2">
    <!-- Main buttons row -->
    <div class="flex gap-2 flex-wrap mb-2 items-center">
      <button class="btn btn-primary" @click="generatePuzzle">Re‑generate</button>
      <button class="btn btn-secondary" @click="downloadPng">Download PNG</button>
      <button class="btn btn-accent" @click="downloadBulk">Download bulk</button>
      <!-- number‑of‑wallpapers input (no label) -->
      <input
          type="number"
          class="input input-bordered w-20"
          v-model.number="numWallpapers"
          :min="1"
          :max="100"
      />
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
            <option value="1920x1080">1920 × 1080</option>
            <option value="2560x1440">2560 × 1440</option>
            <option value="1280x720">1280 × 720</option>
            <option value="1080x1920">1080 × 1920</option>
            <option value="720x1280">720 × 1280</option>
            <option value="1440x2560">1440 × 2560</option>
          </select>
        </div>

        <!-- Puzzle size ratio -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Size Ratio: {{ puzzleSizeRatio }}</label>
          <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              v-model.number="puzzleSizeRatio"
              class="range"
              @input="drawWallpaper"
          />
        </div>

        <!-- Puzzle margin ratio -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Margin Ratio: {{ puzzleMarginRatio }}</label>
          <input
              type="range"
              min="0"
              max="0.3"
              step="0.01"
              v-model.number="puzzleMarginRatio"
              class="range"
              @input="drawWallpaper"
          />
        </div>

        <!-- Grid Y offset (relative) -->
        <div>
          <label class="block font-semibold mb-1">
            Puzzle Y Offset {{ Math.round(gridYOffsetRatio * wallpaperHeight) }} px
          </label>
          <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.01"
              v-model.number="gridYOffsetRatio"
              class="range"
              @input="drawWallpaper"
          />
        </div>

        <!-- Answer Cell Size -->
        <div>
          <label class="block font-semibold mb-1">Answer Cell Size {{ answerCellSize }} px</label>
          <input
              type="range"
              min="10"
              max="300"
              step="1"
              v-model.number="answerCellSize"
              class="range"
              @input="drawWallpaper"
          />
        </div>

        <!-- Answer Cell Gap -->
        <div>
          <label class="block font-semibold mb-1">Answer Cell Gap {{ answerGap }} px</label>
          <input
              type="range"
              min="0"
              max="50"
              step="1"
              v-model.number="answerGap"
              class="range"
              @input="drawWallpaper"
          />
        </div>

        <!-- Answer Cell Roundness (relative) -->
        <div>
          <label class="block font-semibold mb-1">
            Answer Cell Roundness: {{ (answerCellRadiusRatio * 100).toFixed(0) }} %
          </label>
          <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              v-model.number="answerCellRadiusRatio"
              class="range"
              @input="drawWallpaper"
          />
        </div>

        <!-- Puzzle Border Color + Alpha -->
        <div>
          <label class="block font-semibold mb-1">Puzzle Border Color</label>
          <input
              type="color"
              class="input input-bordered w-full"
              v-model="borderColor"
              @input="drawWallpaper"
          />
          <label class="block font-semibold mt-2">Border Alpha: {{ borderAlpha }}</label>
          <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              v-model.number="borderAlpha"
              class="range"
              @input="drawWallpaper"
          />
        </div>

        <!-- Puzzle Border Roundness (relative) -->
        <div>
          <label class="block font-semibold mb-1">
            Puzzle Border Roundness {{ (borderRadiusRatio * 100).toFixed(1) }} %
          </label>
          <input
              type="range"
              min="0"
              max="0.2"
              step="0.005"
              v-model.number="borderRadiusRatio"
              class="range"
              @input="drawWallpaper"
          />
        </div>
      </div>
    </div>
  </div>
</template>
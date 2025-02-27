<template>
  <div class="p-2">
    <!-- The canvas is 1920x1080 in internal resolution.
         You can add custom CSS for scaling down visually if you want. -->
    <canvas ref="canvasRef" width="1920" height="1080"></canvas>

    <div class="mt-2 flex gap-2">
      <button class="btn btn-primary" @click="generatePuzzle">re-generate</button>
      <button class="btn btn-secondary" @click="downloadJpg">download</button>
      <button class="btn btn-accent" @click="downloadTen">download 10</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// We'll reuse the shape flavor & puzzle logic
import { shapeFlavor } from '@/js/puzzle_flavors/shapeFlavor.js'
import {generateCellsAndAnswers } from '@/js/generator.js'
import { drawPuzzleGrid } from '@/js/drawer.js'
import {generateSetOfGridsMaximumDifficulty} from "@/js/grids";

// Helper to download canvas as JPG
function downloadCanvasAsJpg(canvas, filename = "wallpaper.jpg") {
  const link = document.createElement("a")
  link.download = filename
  // Use image/jpeg with some quality factor (0.9 or 0.95)
  link.href = canvas.toDataURL("image/jpeg", 0.95)
  link.click()
}

const canvasRef = ref(null)
const puzzleData = ref(null)

/**
 * Generate a new puzzle (3x3) with shapes & colors
 * We'll use 2 features: shape and color
 */
function generatePuzzle() {
  // (numFeatures=2, numNonConstantFeatures=2) means both shape & color are varied
  const grids = generateSetOfGridsMaximumDifficulty(Object.keys(shapeFlavor.getFeaturesVariations()).length)
  puzzleData.value = generateCellsAndAnswers(grids, shapeFlavor, 9)
  drawWallpaper()
}

const drawGradient = (ctx, w, h) => {
  const grd = ctx.createLinearGradient(0, 0, w, h)
  const colors = ["#1A1A1D", "#3B1C32", "#6A1E55", "#A64D79"];
  const stops = [0, 0.3, 0.8, 1]

  colors.forEach((color, index) => {
    grd.addColorStop(stops[index], color);
  });
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, w, h)
}

/**
 * Draw everything onto the 1920x1080 canvas:
 * - Dark gradient background
 * - Puzzle in the middle, question mark style
 * - 9 answers along the bottom
 */
function drawWallpaper() {
  const canvas = canvasRef.value
  if (!canvas || !puzzleData.value) return
  const ctx = canvas.getContext('2d')

  drawGradient(ctx, canvas.width, canvas.height)

  // Puzzle in the center: 3x3 grid
  const puzzleSize = canvas.height * 0.7
  const puzzleX = (canvas.width - puzzleSize) / 2
  const puzzleY = (canvas.height - puzzleSize) * 0.3
  drawPuzzleGrid(
      ctx,
      puzzleX,
      puzzleY,
      puzzleSize,
      puzzleData.value.cells,
      shapeFlavor.drawCell,
      // "q" means the answer cell is replaced with "?"
      'q',
      'ffffff'
  )

  // Answers row at the bottom
  drawAnswersRow(ctx, puzzleData.value.answers)
}

function drawAnswersRow(ctx, answers) {
  if (!answers || answers.length === 0) return

  const cellSize = 100
  const margin = 10
  const totalWidth = answers.length * cellSize + (answers.length - 1) * margin
  const startX = (ctx.canvas.width - totalWidth) / 2
  const y = ctx.canvas.height - cellSize - 50

  for (let i = 0; i < answers.length; i++) {
    const cellX = startX + i * (cellSize + margin)

    // optional: a subtle bounding box
    ctx.fillStyle = "rgba(255,255,255,0.15)"
    ctx.fillRect(cellX, y, cellSize, cellSize)

    // now draw the shape
    ctx.save()
    ctx.beginPath()
    shapeFlavor.drawCell(ctx, answers[i], cellX, y, cellSize)
    ctx.restore()
  }
}

function downloadJpg() {
  downloadCanvasAsJpg(canvasRef.value, "wallpaper.jpg")
}

/**
 * Generate and download 10 different wallpapers.
 */
function downloadTen() {
  // We'll store the current puzzle to restore afterwards
  const oldPuzzle = puzzleData.value

  for (let i = 1; i <= 10; i++) {
    generatePuzzle()
    downloadCanvasAsJpg(canvasRef.value, `wallpaper_${i}.jpg`)
  }

  // Restore the old puzzle and re-draw
  puzzleData.value = oldPuzzle
  drawWallpaper()
}

onMounted(() => {
  generatePuzzle()
})
</script>

<style scoped>
/* Example: scale the display size to half, so it won't overflow.
   The internal resolution is still 1920x1080 for downloads. */

canvas {
  width: 960px;
  height: 540px;
  border: 1px solid #444;
}
</style>

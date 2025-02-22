// cells - 2D array of cell objects
// drawCell - function that draws a single cell (ctx, cell, x, y, size)
export const drawPuzzleGrid = (ctx, startX, startY, puzzleSize, cells, drawCell) => {
    ctx.fillStyle = "#000"
    ctx.fillRect(startX, startY, puzzleSize, puzzleSize)

    const cellSize = puzzleSize / 3

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = cells[row][col]
            const cellX = startX + col * cellSize
            const cellY = startY + row * cellSize
            drawCell(ctx, cell, cellX, cellY, cellSize)
        }
    }
}


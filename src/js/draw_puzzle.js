// cells - 2D array of cell objects
// drawCell - function that draws a single cell (ctx, cell, x, y, size)
export const drawPuzzleGrid = (ctx, startX, startY, puzzleSize, cells, drawCell) => {
    ctx.strokeStyle = "#00000055";
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY, puzzleSize, puzzleSize);

    const cellSize = puzzleSize / 3

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = cells[row][col]
            const cellX = startX + col * cellSize
            const cellY = startY + row * cellSize

            // outline the cell
            ctx.strokeStyle = "#00000033";
            ctx.lineWidth = 1;
            ctx.strokeRect(cellX, cellY, cellSize, cellSize);

            ctx.save()
            drawCell(ctx, cell, cellX, cellY, cellSize)
            ctx.restore()
        }
    }
}


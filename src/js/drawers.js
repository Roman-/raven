// Helper function to draw one square
function drawSquare(ctx, row, col, cellSize, letter, color) {
    const x = col * cellSize;
    const y = row * cellSize;

    // Draw the cell background
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cellSize, cellSize);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x, y, cellSize, cellSize);

    // Draw the foreground text (letter)
    ctx.fillStyle = "#000";
    ctx.font = "120px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, x + cellSize / 2, y + cellSize / 2);
}

export function drawGrid(grid, propPicks, ctx, cellSize) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            // The value at grid[row][col] is the index in propPicks arrays
            const index = grid[row][col];
            const letter = propPicks.fg[index];
            const color = propPicks.bg[index];

            drawSquare(ctx, row, col, cellSize, letter, color);
        }
    }
}


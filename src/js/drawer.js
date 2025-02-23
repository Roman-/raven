// cells - 2D array of cell objects
// drawCell - function that draws a single cell (ctx, cell, x, y, size)
// revealAnswer - boolean: if true, draw the real cell instead of question mark
// answerStyle: 'q' for question mark, 'n' for normal, 'r' for revealed (outlined)
export const drawPuzzleGrid = (ctx, startX, startY, puzzleSize, cells, drawCell, answerStyle) => {
    if (!cells || cells.length === 0 || !drawCell) {
        return;
    }
    ctx.strokeStyle = "#00000055";
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY, puzzleSize, puzzleSize);

    const cellSize = puzzleSize / 3;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = cells[row][col];
            const cellX = startX + col * cellSize;
            const cellY = startY + row * cellSize;

            // outline the cell
            ctx.strokeStyle = "#00000033";
            ctx.lineWidth = 1;
            ctx.strokeRect(cellX, cellY, cellSize, cellSize);

            ctx.save();
            if (cell.isAnswer && answerStyle === 'q') {
                drawQuestionMark(ctx, cellX, cellY, cellSize);
            } else {
                drawCell(ctx, cell, cellX, cellY, cellSize);
            }
            if (cell.isAnswer && answerStyle === 'r') {
                const margin = 1
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = margin
                ctx.strokeRect(cellX + margin, cellY + margin, cellSize - margin * 2, cellSize - margin * 2);
            }
            ctx.restore();
        }
    }
};

const drawQuestionMark = (ctx, x, y, size) => {
    ctx.font = `${Math.floor(size * 0.6)}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", x + size / 2, y + size / 2);
};

// cells - 2D array of cell objects
// drawCell - function that draws a single cell (offscreenCtx, cell, size, rand)
// revealAnswer - boolean: if true, draw the real cell instead of question mark
// answerStyle: 'q' for question mark, 'n' for normal, 'r' for revealed (outlined)
import {seededRandom} from "@/js/helpers";
import {store} from "@/store/store";

export const drawPuzzleGrid = (ctx, startX, startY, puzzleSize, cells, drawCell, seedOfCellZero, answerStyle, strokeShade = "000000") => {
    if (!cells || cells.length === 0 || !drawCell) {
        return;
    }

    // Draw the outer border of the puzzle
    ctx.strokeStyle = `#${strokeShade}55`;
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY, puzzleSize, puzzleSize);

    // Each puzzle is 3x3, so each cell is puzzleSize/3
    const cellSize = puzzleSize / 3;

    // Create a single offscreen canvas once
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = cellSize;
    offscreenCanvas.height = cellSize;
    const offscreenCtx = offscreenCanvas.getContext('2d');

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = cells[row][col];
            const seed = seedOfCellZero + cell.index

            // Outline each cell
            const cellX = startX + col * cellSize;
            const cellY = startY + row * cellSize;
            ctx.strokeStyle = `#${strokeShade}33`;
            ctx.lineWidth = 1;
            ctx.strokeRect(cellX, cellY, cellSize, cellSize);

            // Clear the offscreen canvas and draw the cell
            offscreenCtx.clearRect(0, 0, cellSize, cellSize);

            // If it's an answer cell and we're showing question marks:
            if (cell.isAnswer && answerStyle === 'q') {
                drawQuestionMark(offscreenCtx, 0, 0, cellSize);
            } else {
                drawCell(offscreenCtx, cell, cellSize, seededRandom(seed));
            }

            // Now copy that offscreen result onto the main canvas
            ctx.drawImage(offscreenCanvas, cellX, cellY);

            // If it's a revealed cell, outline it with a bold stroke
            if (cell.isAnswer && answerStyle === 'r') {
                const margin = 1;
                ctx.strokeStyle = `#${strokeShade}`;
                ctx.lineWidth = margin;
                ctx.strokeRect(
                    cellX + margin,
                    cellY + margin,
                    cellSize - margin * 2,
                    cellSize - margin * 2
                );
            }
        }
    }
};

const drawQuestionMark = (ctx, x, y, size) => {
    ctx.fillStyle = "#aaaaaa";
    ctx.font = `${Math.floor(size * 0.6)}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", x + size / 2, y + size / 2);
};

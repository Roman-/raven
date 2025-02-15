// Helper function to draw one square
import {shuffle} from "@/js/helpers";

function drawSquare(ctx, row, col, cellSize, letter, color, isQuestion) {
    const x = col * cellSize;
    const y = row * cellSize;

    // Draw the cell background
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x, y, cellSize, cellSize);
    if (isQuestion) {
        ctx.fillStyle = "#000";
        ctx.font = `${cellSize * 0.7}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("?", x + cellSize / 2, y + cellSize / 2);
        return;
    }

    // ctx.fillStyle = color;
    // ctx.fillRect(x, y, cellSize, cellSize);

    // Draw the foreground text (letter)
    ctx.fillStyle = "#000";
    ctx.font = `${cellSize * 0.7}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(letter, x + cellSize / 2, y + cellSize / 2);
}

function fillWithPleasantGradient(ctx, canvasSize) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    const rnd = () => Math.random() > 0.5 ? 0 : canvasSize;
    const gradient = ctx.createLinearGradient(rnd(), rnd(), rnd(), rnd());
    const colors = shuffle([ "#DCF1FF", "#F0E7FF", "#FFDCE1"])
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
}

export function drawGrid(grid, propPicks, ctx, canvasSize) {
    fillWithPleasantGradient(ctx, canvasSize);
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            // The value at grid[row][col] is the index in propPicks arrays
            const index = grid[row][col];
            const letter = propPicks.fg[index];
            const color = propPicks.bg[index];

            const cellSize = canvasSize / 3;
            const isQuestion = (row === 2 && col === 2);
            drawSquare(ctx, row, col, cellSize, letter, color, isQuestion);
        }
    }
}


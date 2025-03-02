export const tiledLinesFlavor = {
    name: 'Tiled Lines',
    description: 'Zig-zag pattern of lines',
    isArtistic: true,
    getFeaturesVariations: () => {
        return {
            'stepFactor': [0.1, 0.2, 0.4],
            'lineWidthFactor': [0.005, 0.020, 0.050],
        }
    },
    drawCell: (ctx, cell, size) => {
        const lineWidth = size * cell.lineWidthFactor;
        drawLines(ctx, size, cell.stepFactor, lineWidth);
    }
}

function drawLines(ctx, size, stepFactor, lineWidth) {
    ctx.beginPath(); // cancel any previous path
    const step = size * stepFactor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'square';
    ctx.strokeStyle = '#000000';
    function drawSingleLine(x, y, width, height) {
        const leftToRight = Math.random() >= 0.5;

        if (leftToRight) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y + height);
        } else {
            ctx.moveTo(x + width, y);
            ctx.lineTo(x, y + height);
        }

    }

    for(var x = 0; x < size; x += step) {
        for(var y = 0; y < size; y+= step) {
            drawSingleLine(x, y, step, step);
        }
    }
    ctx.stroke();
}

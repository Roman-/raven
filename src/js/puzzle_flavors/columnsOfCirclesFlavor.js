export const columnsOfCirclesFlavor = {
    name: 'Columns of Circles',
    description: 'Circles arranged in columns',
    isArtistic: true,
    getFeaturesVariations: () => {
        return {
            'numColumns': [4, 8, 16],
            'verticalDistance': [0.05, 0.5, 1],
        }
    },
    drawCell: (ctx, cell, size) => {
        drawColumnsOfCircles(ctx, size, cell.numColumns, cell.verticalDistance);
    }
}

function drawColumnsOfCircles(ctx, size, numColumns, verticalDistance) {
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    const radius = size / (numColumns * 2);
    const diameter = radius * 2;
    const stepY = diameter * verticalDistance;

    for (let i = 0; i < numColumns; i++) {
        let x = radius * (2 * i + 1);
        let y = -diameter;
        while (y < size + diameter) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            ctx.fill();
            ctx.closePath();
            y += stepY;
        }
    }
}

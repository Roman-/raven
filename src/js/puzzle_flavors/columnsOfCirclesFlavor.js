export const columnsOfCirclesFlavor = {
    name: 'Columns of Circles',
    description: 'Circles arranged in columns',
    isArtistic: true,
    getFeaturesVariations: () => {
        return {
            'numColumns': [4, 8, 14],
            'verticalDistance': [0.2, 0.7, 1],
        }
    },
    drawCell: (ctx, cell, size, rand) => {
        drawColumnsOfCircles(ctx, size, cell.numColumns, cell.verticalDistance, rand);
    }
}

function drawColumnsOfCircles(ctx, size, numColumns, verticalDistance, rand) {
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    const radius = size / (numColumns * 2);
    const diameter = radius * 2;
    const stepY = diameter * verticalDistance;

    let hue = Math.ceil(rand() * 360)
    for (let i = 0; i < numColumns; i++) {
        const even = i % 2 === 0;
        let x = radius * (2 * i + 1);
        let y = even ? -diameter : size + diameter;
        while (even ? y < size + diameter : y > -diameter) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue}, 90%, 50%)`;
            ctx.fill();
            ctx.closePath();
            y += even ? stepY : -stepY;
            hue += (113);
        }
    }
}

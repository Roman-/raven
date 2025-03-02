export const columnsOfCirclesFlavor = {
    name: 'Columns of Circles',
    description: 'Circles arranged in columns',
    getFeaturesVariations: () => {
        return {
            'numColumns': [4, 8, 16],
            'circlesPerColumn': [40, 70, 120],
        }
    },
    drawCell: (ctx, cell, size) => {
        drawColumnsOfCircles(ctx, size, cell.numColumns, cell.circlesPerColumn);
    }
}

function drawColumnsOfCircles(ctx, size, numColumns, circlesPerColumn) {
    const radius = Math.ceil(size / (numColumns * 2));
    const diameter = radius * 2;
    const stepY = (size + 2 * diameter) / (circlesPerColumn - 1);

    for (let i = 0; i < numColumns; i++) {
        let x = radius * (2 * i + 1);
        let y = -diameter;
        for (let j = 0; j < circlesPerColumn; j++) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            ctx.fill();
            ctx.closePath();
            y += stepY;
        }
    }
}

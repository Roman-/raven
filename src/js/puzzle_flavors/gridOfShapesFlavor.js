export const gridOfShapesFlavor = {
    name: 'Grid of Shapes',
    description: 'Draws a grid of shapes with varying grid size and shape type',
    isArtistic: false,
    getFeaturesVariations: () => ({
        gridSize: [1, 2, 3],
        shape: ['circle', 'square', 'diamond'],
    }),
    drawCell: (ctx, cell, size, rand) => {
        // fractional constants
        const gridSize  = cell.gridSize;
        const cellSize  = size / gridSize;
        const shapeSize = cellSize * 0.6;
        const offset    = (cellSize - shapeSize) * 0.4;
        const lineW     = size * 0.006;

        // shape styling
        ctx.lineWidth   = lineW;
        ctx.strokeStyle = '#eeeeee';
        ctx.fillStyle   = '#020502';

        // draw grid of shapes
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x = i * cellSize;
                const y = j * cellSize;
                ctx.beginPath();
                switch (cell.shape) {
                    case 'circle':
                        ctx.arc(x + cellSize/2, y + cellSize/2, shapeSize/2, 0, 2*Math.PI);
                        break;
                    case 'square':
                        ctx.rect(x + offset, y + offset, shapeSize, shapeSize);
                        break;
                    case 'diamond':
                        const cx = x + cellSize/2;
                        const cy = y + cellSize/2;
                        const d  = shapeSize / 2;
                        ctx.moveTo(cx,     cy - d);
                        ctx.lineTo(cx + d, cy    );
                        ctx.lineTo(cx,     cy + d);
                        ctx.lineTo(cx - d, cy    );
                        ctx.closePath();
                        break;
                }
                ctx.stroke();
                ctx.fill();
            }
        }
    },
};

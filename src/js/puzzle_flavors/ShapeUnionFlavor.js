import {drawRegularPolygonPath} from "@/js/draw/drawingCommon";

export const shapeUnionFlavor = {
    name: 'Shape Union',
    description: 'A, B, A+B',
    isArtistic: false,
    getFeaturesVariations: () => {
        return {
            'parts': ['A', 'B', 'AB'],
        }
    },
    drawCell: (ctx, cell, size, rand) => {
        if (cell.parts.startsWith('A')) {
            drawShapeA(ctx, size);
        }
        if (cell.parts.endsWith('B')) {
            drawShapeB(ctx, size);
        }
    }
}

function drawShapeA(ctx, size) {
    ctx.beginPath();
    drawRegularPolygonPath(ctx, 0, 0, size, 6, Math.PI * 2);
    ctx.stroke()
}

function drawShapeB(ctx, size) {
    const margin = size / 5;
    ctx.beginPath();
    drawRegularPolygonPath(ctx, margin, margin, size - margin * 2, 3);
    ctx.stroke()
}

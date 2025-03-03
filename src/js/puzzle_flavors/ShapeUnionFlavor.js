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
        if (cell.parts.includes('A')) {
            drawShapeA(ctx, size);
        }
        if (cell.parts.includes('B')) {
            drawShapeB(ctx, size);
        }
    }
}

function drawShapeA(ctx, size) {
    drawRegularPolygonPath(ctx, 0, 0, size, 6, Math.PI * 2);
    ctx.stroke()
}

function drawShapeB(ctx, size) {
    const margin = size / 5;
    drawRegularPolygonPath(ctx, margin, margin, size - margin * 2, 3, Math.PI * 2);
    ctx.stroke()
}

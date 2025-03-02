import {randomElement} from "@/js/helpers";
import {drawCirclePath, drawRegularPolygonPath, drawSquarePath} from "@/js/draw/drawingCommon";

function drawShape(ctx, shape, x, y, size) {
    switch (shape) {
        case 'circle': return drawCirclePath(ctx, x, y, size)
        case 'triangle':  return drawIsoscelestrianglePath(ctx, x, y, size)
        case 'square': return drawSquarePath(ctx, x, y, size)
        case 'pentagon': return drawRegularPolygonPath(ctx, x, y, size, 5, -Math.PI / 2)
        default: console.error("drawShape: Unsupported shape", shape)
    }
}

function drawIsoscelestrianglePath(ctx, x, y, size) {
    ctx.moveTo(x + size / 2, y + size / 6)            // top vertex
    ctx.lineTo(x + size / 6, y + (5 * size) / 6)      // bottom-left
    ctx.lineTo(x + (5 * size) / 6, y + (5 * size) / 6)// bottom-right
    ctx.closePath()
}

const getRandomPaletteForShapes = () => {
    return randomElement([
        ["#393E46", "#00ADB5", "#EEEEEE"],
        ["#FFC7C7", "#F6F6F6", "#8785A2"],
        ["#F38181", "#FCE38A", "#95E1D3"],
        ["#A8D8EA", "#AA96DA", "#FCBAD3"],
        ["#3FC1C9", "#F5F5F5", "#FC5185"],
    ]);
}

export const shapeFlavor = {
    name: 'Shapes',
    description: 'Simple colored shapes (circle, triangle etc.)',
    getFeaturesVariations: () => {
        return {
            'shape': ['circle', 'triangle', 'square', 'pentagon'],
            'color': getRandomPaletteForShapes(),
        }
    },
    drawCell: (ctx, cell, size, rand) => {
        // Set the stroke & fill styles from the cell's features
        ctx.fillStyle = cell.color || 'gray'
        ctx.lineWidth = 3
        ctx.strokeStyle = 'black'

        ctx.beginPath()
        drawShape(ctx, cell.shape, 0, 0, size)
        ctx.fill()
        ctx.stroke()
    }
}

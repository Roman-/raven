import {randomElement} from "@/js/helpers";
import {drawCirclePath, drawRegularPolygonPath, drawSquarePath} from "@/js/draw/drawingCommon";

function drawShape(ctx, shape, x, y, size) {
    switch (shape) {
        case 'circle': return drawCirclePath(ctx, x, y, size)
        case 'triangle-r':  return drawRegularPolygonPath(ctx, x, y, size, 3, 0)
        case 'triangle-l':  return drawRegularPolygonPath(ctx, x, y, size, 3, Math.PI)
        case 'square': return drawSquarePath(ctx, x, y, size)
        case 'pentagon': return drawRegularPolygonPath(ctx, x, y, size, 5)
        default: console.error("drawShape: Unsupported shape", shape)
    }
}

const getRandomPaletteForShapes = () => {
    return randomElement([
        ["#565b63", "#00ADB5", "#EEEEEE"],
        ["#FFC7C7", "#F6F6F6", "#8785A2"],
        ["#F38181", "#FCE38A", "#95E1D3"],
        ["#A8D8EA", "#AA96DA", "#FCBAD3"],
        ["#3FC1C9", "#F5F5F5", "#FC5185"],
    ]);
}

export const multiShapeFlavor = {
    name: 'Fancy Shapes',
    description: 'Shapes in multiple amounts',
    getFeaturesVariations: () => {
        return {
            'shape': ['circle', 'triangle-r', 'triangle-l', 'square', 'pentagon'],
            'color': getRandomPaletteForShapes(),
            'amount': [1, 2, 3]
        }
    },
    drawCell: (ctx, cell, x, y, size) => {
        // Set the stroke & fill styles from the cell's features
        ctx.fillStyle = cell.color || 'gray'
        ctx.lineWidth = 3
        ctx.strokeStyle = 'black'

        const sizeChange = size * 0.3
        for (let i = 0; i < cell.amount; i++) {
            ctx.beginPath()
            drawShape(ctx, cell.shape, x, y, size)
            ctx.fill()
            ctx.stroke()
            size -= sizeChange
            x += sizeChange / 2
            y += sizeChange / 2
        }
    }
}
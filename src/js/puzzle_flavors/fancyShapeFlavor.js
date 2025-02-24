import {randomElement} from "@/js/helpers";

function drawShape(ctx, shape, x, y, size) {
    switch (shape) {
        case 'circle': return drawCirclePath(ctx, x, y, size)
        case 'triangle':  return drawTrianglePath(ctx, x, y, size)
        case 'square': return drawSquarePath(ctx, x, y, size)
        case 'pentagon': return drawPentagonPath(ctx, x, y, size)
        default: console.error("drawShape: Unsupported shape", shape)
    }
}

function drawCirclePath(ctx, x, y, size) {
    const centerX = x + size / 2
    const centerY = y + size / 2
    const radius = size / 3
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
}

function drawTrianglePath(ctx, x, y, size) {
    const side   = (2/3) * size;               // triangle side = 2/3 of bounding box
    const height = side * (Math.sqrt(3) / 2);  // height of equilateral triangle
    const offsetX = x + (size - side)   / 2;   // center horizontally
    const offsetY = y + (size - height) / 2;   // center vertically

    ctx.moveTo(offsetX + side / 2, offsetY);            // top vertex
    ctx.lineTo(offsetX,             offsetY + height);  // bottom-left
    ctx.lineTo(offsetX + side,      offsetY + height);  // bottom-right
    ctx.closePath();
}

function drawSquarePath(ctx, x, y, size) {
    const margin = size / 6
    ctx.rect(x + margin, y + margin, size - 2 * margin, size - 2 * margin)
}

function drawPentagonPath(ctx, x, y, size) {
    const margin = size * 0.2
    size -= margin
    x += margin / 2
    y += margin / 2

    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const radius = size / 2; // Adjusted for better proportion
    const sides = 5;
    const angleOffset = -Math.PI / 2; // Rotates the pentagon so the top is at the very top

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = i * (2 * Math.PI / sides) + angleOffset;
        const px = centerX + radius * Math.cos(angle);
        const py = centerY + radius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
}

const getRandomPaletteForShapes = () => {
    return randomElement([
        ["#565b63", "#00ADB5", "#EEEEEE"],
        ["#FFC7C7", "#F6F6F6", "#8785A2"],
        ["#F38181", "#FCE38A", "#95E1D3"],
        ["#A8D8EA", "#AA96DA", "#FCBAD3"],
        ["#3FC1C9", "#F5F5F5", "#FC5185"],
        ["#E84545", "#903749", "#53354A"]
    ]);
}

export const fancyShapeFlavor = {
    name: 'Fancy Shapes',
    description: 'Shapes in multiple amounts',
    getFeaturesVariations: () => {
        return {
            'shape': ['circle', 'triangle', 'square', 'pentagon'],
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


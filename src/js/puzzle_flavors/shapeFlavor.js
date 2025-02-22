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
    ctx.moveTo(x + size / 2, y + size / 6)            // top vertex
    ctx.lineTo(x + size / 6, y + (5 * size) / 6)      // bottom-left
    ctx.lineTo(x + (5 * size) / 6, y + (5 * size) / 6)// bottom-right
    ctx.closePath()
}

function drawSquarePath(ctx, x, y, size) {
    // Just an inset square for aesthetic
    const margin = size / 6
    ctx.rect(x + margin, y + margin, size - 2 * margin, size - 2 * margin)
}

function drawPentagonPath(ctx, x, y, size) {
    // Basic approach: 5 points around a circle
    const centerX = x + size / 2
    const centerY = y + size / 2
    const radius = size / 3
    const sides = 5
    const angleStep = (2 * Math.PI) / sides
    ctx.moveTo(
        centerX + radius * Math.cos(0),
        centerY + radius * Math.sin(0)
    )
    for (let i = 1; i < sides; i++) {
        const angle = i * angleStep
        ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        )
    }
    ctx.closePath()
}

export const shapeFlavor = {
    name: 'Shapes',
    description: 'Simple colored shapes (circle, triangle etc.)',
    getFeaturesVariations: () => {
        return {
            'shape': ['circle', 'triangle', 'square', 'pentagon'],
            'color': ['#FFD23F', '#337357', '#EE4266'],
        }
    },
    drawCell: (ctx, cell, x, y, size) => {
        // Set the stroke & fill styles from the cell's features
        ctx.fillStyle = cell.color || 'gray'
        ctx.lineWidth = 3
        ctx.strokeStyle = 'black'

        ctx.beginPath()
        drawShape(ctx, cell.shape, x, y, size)
        ctx.fill()
        ctx.stroke()
    }
}


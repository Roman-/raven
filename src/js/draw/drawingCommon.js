export function drawRegularPolygonPath(ctx, x, y, size, numSides, angleOffset = -Math.PI / 2) {
    const margin = size * 0.2
    size -= margin
    x += margin / 2
    y += margin / 2

    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const radius = size / 2; // Adjusted for better proportion

    for (let i = 0; i < numSides; i++) {
        const angle = i * (2 * Math.PI / numSides) + angleOffset;
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

export function drawSquarePath(ctx, x, y, size) {
    const margin = size / 6
    ctx.rect(x + margin, y + margin, size - 2 * margin, size - 2 * margin)
}

export function drawCirclePath(ctx, x, y, size) {
    const centerX = x + size / 2
    const centerY = y + size / 2
    const radius = size / 3
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
}


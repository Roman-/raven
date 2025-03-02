export const colorWheelFlavor = {
    name: 'Color Wheel',
    description: 'HSL colors and thickness',
    isArtistic: true,
    getFeaturesVariations: () => {
        return {
            'thickness': [0.15, 0.3, 0.5],
            'slices': [8, 20, 50],
            'hueShift': [0, 90, 180, 270],
        }
    },
    drawCell: (ctx, cell, size) => {
        drawColorRing(ctx, size/2, size/2, size * 0.9, size * 0.9 * cell.thickness, cell.slices, cell.hueShift);
    }
}

/**
 * Returns an array of points (x, y) for a regular polygon.
 * @param {number} centerX - The x-coordinate of the polygon center
 * @param {number} centerY - The y-coordinate of the polygon center
 * @param {number} radius  - The radius of the polygon
 * @param {number} numSides - Number of sides (segments)
 * @param {number} angleOffset - An offset in radians, default -Math.PI/2
 */
function getRegularPolygonPoints(
    centerX,
    centerY,
    radius,
    numSides,
    angleOffset = -Math.PI / 2
) {
    const points = [];
    for (let i = 0; i < numSides; i++) {
        const angle = i * (2 * Math.PI / numSides) + angleOffset;
        const px = centerX + radius * Math.cos(angle);
        const py = centerY + radius * Math.sin(angle);
        points.push({ x: px, y: py });
    }
    return points;
}

/**
 * Draw a color ring (like a color wheel) made of quadrilaterals,
 * each with a distinct hue.
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {number} centerX - Center x of the ring
 * @param {number} centerY - Center y of the ring
 * @param {number} outerSize - The approximate diameter of the outer ring
 * @param {number} thickness - Thickness of the ring
 * @param {number} sections - Number of color slices
 */
function drawColorRing(
    ctx,
    centerX,
    centerY,
    outerSize,
    thickness,
    sections,
    hueShift
) {
    const outerRadius = outerSize / 2;
    const innerRadius = outerRadius - thickness;

    // Get the points for the outer and inner polygons
    const outerPoints = getRegularPolygonPoints(
        centerX,
        centerY,
        outerRadius,
        sections
    );
    const innerPoints = getRegularPolygonPoints(
        centerX,
        centerY,
        innerRadius,
        sections
    );

    // Draw each slice as a quadrilateral
    for (let i = 0; i < sections; i++) {
        const iNext = (i + 1) % sections;

        const p1 = outerPoints[i];
        const p2 = outerPoints[iNext];
        const p3 = innerPoints[iNext];
        const p4 = innerPoints[i];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();

        // Calculate hue from 0..360 across all sections
        const hue = (200 * i) / sections + hueShift;

        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

        ctx.fill();
    }
}
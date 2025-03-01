export const zigZagWithCirclesFlavor = {
    name: 'Zig zag line with circles',
    description: 'Horizontal zig zag line drawn with circles of different sizes and amplitude',
    getFeaturesVariations: () => {
        return {
            'amplitude': [0.1, 0.5, 0.8],
            'frequency': [0.1, 0.5, 0.8],
            // 'phase': [0, 0.5, 1],
            'numCircles': [10, 15, 20],
            'circleRadius': [0.01, 0.03, 0.05],
            // 'palette': [['red', 'blue'], ['green', 'yellow'], ['purple', 'orange']],
        }
    },
    drawCell: (ctx, cell, size) => {
        drawZigZagWithCircles(ctx, size, cell.amplitude, cell.frequency, 0, cell.numCircles, cell.circleRadius, ['red', 'blue'])
    }
}
/**
 * Draws a broken zig-zag line from (0, size/2) to (size, size/2)
 * and places circles evenly spaced along the path.
 *
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
 * @param {number} size - The width/height of the canvas
 * @param {number} amplitude - Range [0..1], 1 => max vertical excursion
 * @param {number} frequency - Number of full up/down cycles
 * @param {number} phase - In [0..1], shifts initial peak up (0) or down (0.5)
 * @param {number} numCircles - Total circles to draw along the zig-zag
 * @param {number} circleRadius - Circle radius as a fraction of `size`
 * @param {string[]} palette - Array of color strings for the circles
 */
function drawZigZagWithCircles(ctx, size, amplitude, frequency, phase, numCircles, circleRadius, palette) {
    // ---- 1. Compute the zig-zag vertices ----

    // Vertical center
    const centerY = size / 2;
    // Maximum vertical excursion in pixels
    const ampPx = amplitude * (size / 2);
    // Horizontal step between zig-zag vertices
    // For `frequency` full cycles, we have 2*frequency segments => (2*frequency + 1) points
    const totalSegments = 2 * frequency;            // number of line segments = totalSegments
    const stepX = size / totalSegments;             // distance in x between each vertex

    // Determine "phase shift" in up/down direction:
    //   If phase < 0.5, first peak is up, else first peak is down.
    //   You can refine this logic if you want more advanced phase shifting.
    const phaseShift = (phase >= 0.5) ? 1 : 0;

    // Build array of points in the zig-zag
    const points = [];
    for (let i = 0; i <= totalSegments; i++) {
        const x = i * stepX;
        let y;

        if (i === 0 || i === totalSegments) {
            // Start and end at center
            y = centerY;
        } else {
            // Zig-zag: alternate up/down
            // If (i + phaseShift) is odd => +amp; even => -amp
            const isOdd = ((i + phaseShift) % 2 === 1);
            y = centerY + (isOdd ? +ampPx : -ampPx);
        }

        points.push({ x, y });
    }

    // ---- 2. Draw the zig-zag line ----
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = "#000"; // Or any line color you prefer
    ctx.lineWidth = 2;
    ctx.stroke();

    // ---- 3. Measure total path length of the zig-zag ----
    // We'll accumulate lengths of each segment.
    const segmentLengths = [];
    let totalLength = 0;

    for (let i = 0; i < points.length - 1; i++) {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        const segLen = Math.sqrt(dx * dx + dy * dy);
        segmentLengths.push(segLen);
        totalLength += segLen;
    }

    // ---- 4. Place circles evenly spaced along that totalLength ----
    const r = circleRadius * size;               // Actual radius in pixels
    const circleSpacing = totalLength / (numCircles - 1);

    // Function to interpolate between p0 and p1 at fraction t in [0..1]
    function interpolate(p0, p1, t) {
        return {
            x: p0.x + (p1.x - p0.x) * t,
            y: p0.y + (p1.y - p0.y) * t
        };
    }

    // Current distance along the zig-zag as we place each circle
    let distSoFar = 0;

    for (let c = 0; c < numCircles; c++) {
        const targetDist = c * circleSpacing;

        // Find which segment this distance falls into
        let segIndex = 0;
        let accumulated = 0;

        while (
            segIndex < segmentLengths.length &&
            accumulated + segmentLengths[segIndex] < targetDist
            ) {
            accumulated += segmentLengths[segIndex];
            segIndex++;
        }

        // Now interpolate along segment `segIndex`
        if (segIndex >= segmentLengths.length) {
            // Just clamp to the last point
            segIndex = segmentLengths.length - 1;
        }

        const segLen = segmentLengths[segIndex];
        const segmentStart = points[segIndex];
        const segmentEnd = points[segIndex + 1];

        // Fraction along this segment
        const frac = (targetDist - accumulated) / segLen;
        const circlePos = interpolate(segmentStart, segmentEnd, frac);

        // ---- 5. Draw the circle ----
        ctx.beginPath();
        ctx.arc(circlePos.x, circlePos.y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = palette[c % palette.length];
        ctx.fill();
    }
}

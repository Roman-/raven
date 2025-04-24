export const quadrilateralFlavor = {
    name: 'Quadrilateral',
    description: 'Draws a square or trapezoid with a blue gradient fill. Features: shape, gradient direction, color pair.',
    isArtistic: false,
    getFeaturesVariations: () => ({
        shape: ['t', 's', 'b'],                // top-trapeze, square, bottom-trapeze
        direction: ['lr', 'tb', 'radial'],     // left→right, top→bottom, radial
        colors: [
            ['#00FF00', '#FF0000'],
            ['#FF00FF', '#00FFFF'],
            ['#FFFF00', '#00FF00'],
        ]
    }),
    drawCell: (ctx, cell, size, rand) => {
        // size-relative constants
        const lw     = size * 0.02;  // line width
        const margin = size * 0.10;  // inset from edges
        const inset  = size * 0.15;  // trapezoid top/bottom shrink

        ctx.clearRect(0, 0, size, size);
        ctx.lineWidth   = lw;
        ctx.strokeStyle = '#0000AA';

        // Compute the four corners
        let pts;
        if (cell.shape === 's') {
            // square
            pts = [
                {x: margin,            y: margin},
                {x: size - margin,     y: margin},
                {x: size - margin,     y: size - margin},
                {x: margin,            y: size - margin}
            ];
        } else if (cell.shape === 't') {
            // trapezoid with shorter top
            pts = [
                {x: margin + inset,          y: margin},
                {x: size - margin - inset,   y: margin},
                {x: size - margin,           y: size - margin},
                {x: margin,                  y: size - margin}
            ];
        } else {
            // trapezoid with shorter bottom
            pts = [
                {x: margin,                  y: margin},
                {x: size - margin,           y: margin},
                {x: size - margin - inset,   y: size - margin},
                {x: margin + inset,          y: size - margin}
            ];
        }

        // Build the gradient
        const [c1, c2] = cell.colors;
        let grad;
        if (cell.direction === 'lr') {
            grad = ctx.createLinearGradient(margin, size/2, size - margin, size/2);
        } else if (cell.direction === 'tb') {
            grad = ctx.createLinearGradient(size/2, margin, size/2, size - margin);
        } else {
            grad = ctx.createRadialGradient(
                size/2, size/2, margin / 4,
                size/2, size/2, size - margin / 2
            );
        }
        grad.addColorStop(0, c1);
        grad.addColorStop(1, c2);

        // Draw and fill the shape
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
};

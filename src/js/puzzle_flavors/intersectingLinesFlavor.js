import {randomElement} from "@/js/helpers";

export const intersectingLinesFlavor = {
    name: 'TwoLinesIntersection',
    description: 'Two lines crossing at variable angle and with variable relative lengths',
    isArtistic: false,
    getFeaturesVariations: () => ({
        angle: [150, 90, 30],                  // intersection angles in degrees
        lengthRelation: ['longest', 'same', 'shortest'], // line1 relative to line2
    }),
    drawCell: (ctx, cell, size, rand) => {
        const lineWidth      = 0.02 * size;    // 1% of canvas size
        const baseLength     = 0.5  * size;    // reference length for line2
        const center         = size / 2;
        const theta          = cell.angle * Math.PI / 180;
        let   len1;

        // determine line1 length
        if (cell.lengthRelation === 'longest')   len1 = baseLength * 1.8;
        else if (cell.lengthRelation === 'shortest') len1 = baseLength * 0.3;
        else                                      len1 = baseLength;
        const len2 = baseLength;

        // clear canvas
        ctx.clearRect(0, 0, size, size);
        ctx.lineWidth   = lineWidth;
        ctx.strokeStyle = randomElement(["#1A1A1A", "#0B3D91", "#2C2C34", "#123524", "#3B0A45", "#2E1A47"])

        // draw horizontal line (line1)
        ctx.beginPath();
        ctx.moveTo(center - len1 / 2, center);
        ctx.lineTo(center + len1 / 2, center);
        ctx.stroke();

        // draw angled line (line2)
        const dx = Math.cos(theta) * len2 / 2;
        const dy = Math.sin(theta) * len2 / 2;
        ctx.beginPath();
        ctx.moveTo(center - dx, center - dy);
        ctx.lineTo(center + dx, center + dy);
        ctx.stroke();
    },
};

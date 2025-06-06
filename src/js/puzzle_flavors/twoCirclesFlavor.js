import tinycolor from 'tinycolor2'
export const twoCirclesFlavor = {
    name: 'TwoCircles',
    description: 'Two pastel-colored circles with varying relative distance and size',
    isArtistic: false,
    getFeaturesVariations: () => ({
        distanceMode: ['intersect', 'touch', 'apart'],
        color: ['#D33F49', '#D7C0D0', '#77BA99'],
        colorDistributionRule: ['same', 'lighter', 'darker'],
    }),
    drawCell: (ctx, cell, size, rand) => {
        const lineWidth = 0.02 * size;
        const r = 0.18 * size;
        const cx = size / 2;
        const cy = size / 2;
        let d;
        switch (cell.distanceMode) {
            case 'intersect': d = 1.2 * r; break;
            case 'touch':     d = 2 * r;   break;
            case 'apart':     d = 3 * r;   break;
        }
        const x1 = cx - d / 2;
        const x2 = cx + d / 2;
        let baseColor = tinycolor(cell.color);
        const color1 = baseColor.brighten(0.2).toString();
        // let color2 = baseColor.lighten(10).toString();
        let color2;
        switch (cell.colorDistributionRule) {
            case 'lighter':  color2 = baseColor.lighten(30).toString(); break;
            case 'darker':   color2 = baseColor.darken(30).toString(); break;
            default:         color2 = baseColor.toString(); break;
        }

        ctx.clearRect(0, 0, size, size);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = baseColor.darken(40).toString();

        ctx.beginPath();
        ctx.arc(x1, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x2, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = color2;
        ctx.fill();
        ctx.stroke();
    }
};

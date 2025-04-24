export const twoCirclesFlavor = {
    name: 'TwoCircles',
    description: 'Two pastel-colored circles with varying relative distance and size',
    isArtistic: false,
    getFeaturesVariations: () => ({
        distanceMode: ['intersect', 'touch', 'apart'],
        color: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    }),
    drawCell: (ctx, cell, size, rand) => {
        const lineWidth = 0.03 * size;
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
        const color1 = cell.color
        const color2 = cell.color // TODO make it slightly different

        ctx.clearRect(0, 0, size, size);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = cell.strokeColor // TODO make it slightly darker

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

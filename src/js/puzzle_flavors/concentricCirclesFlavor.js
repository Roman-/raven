export const concentricCirclesFlavor = {
    name: 'Concentric Circles',
    description: 'Amount and palette',
    isArtistic: false,
    getFeaturesVariations: () => {
        return {
            'numCircles': [2, 3, 5],
            'palette': [
                ['#0F4C75', '#3282B8'],
                ['#2E236C', '#433D8B'],
                ['#8E1616', '#AE445A'],
                ['#626F47', '#A4B465'],
            ],
        }
    },
    drawCell: (ctx, cell, size, rand) => {
        const margin   = 0.05 * size;  // outer gap
        const strokeW  = 0.01 * size;  // border thickness
        const step     = (size / 2 - margin) / cell.numCircles;

        ctx.lineWidth = strokeW;
        ctx.strokeStyle = '#fff';

        for (let i = 0; i < cell.numCircles; i++) {
            const r = size / 2 - margin - i * step + strokeW / 2;
            ctx.fillStyle = cell.palette[i % cell.palette.length];

            ctx.beginPath();
            ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }
}
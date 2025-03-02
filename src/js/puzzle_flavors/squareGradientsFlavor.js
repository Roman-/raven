export const squareGradientsFlavor = {
    name: 'Gradients',
    description: 'Direction and palette',
    isArtistic: true,
    getFeaturesVariations: () => {
        return {
            'direction': ['right', 'down', 'diag1', 'diag2'],
            'palette': [
                [ "#FCC737", "#F26B0F", "#E73879", "#7E1891" ],
                [ "#C96868", "#FADFA1", "#FFF4EA", "#7EACB5" ],
                [ "#59D5E0", "#F5DD61", "#FAA300", "#F4538A" ],
                ["#F8F5E9",  "#9DC08B", "#3A7D44", "#DF6D14" ],
            ]}
    },
    drawCell: (ctx, cell, size) => {
        // draw a square colored with cell[palette] gradient in the cell[direction]
        const dir = {
            'right': [0, 0, 0 + size, 0],
            'down':  [0, 0, 0, 0 + size],
            'diag1': [0, 0, 0 + size, 0 + size],
            'diag2': [0 + size, 0, 0, 0 + size],
        }
        const gradient = ctx.createLinearGradient(...dir[cell.direction]);
        for (let i = 0; i < cell.palette.length; i++) {
            gradient.addColorStop(i / cell.palette.length, cell.palette[i]);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
    }
}
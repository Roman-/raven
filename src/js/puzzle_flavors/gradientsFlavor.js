export const gradientsFlavor = {
    name: 'Gradients',
    description: 'Direction and colorset',
    getFeaturesVariations: () => {
        return {
            'direction': ['right', 'down', 'diag1', 'diag2'],
            'palette': [[ "#FCC737", "#F26B0F", "#E73879", "#7E1891" ],
                        [ "#B7B1F2", "#FDB7EA", "#FFDCCC", "#FBF3B9" ],
                        [ "#C96868", "#FADFA1", "#FFF4EA", "#7EACB5" ],
                        [ "#59D5E0", "#F5DD61", "#FAA300", "#F4538A" ],
                        [ "#FF0000", "#FFA27F", "#FFE8C5", "#97BE5A" ]]
        }
    },
    drawCell: (ctx, cell, x, y, size) => {
        // draw a square colored with cell[palette] gradient in the cell[direction]
        const dir = {
            'right': [0, 0, size, 0],
            'down':  [0, 0, 0, size],
            'diag1': [0, 0, size, size],
            'diag2': [0, size, size, 0],
        }
        const gradient = ctx.createLinearGradient(...dir[cell.direction]);
        for (let i = 0; i < cell.palette.length; i++) {
            gradient.addColorStop(i / cell.palette.length, cell.palette[i]);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, size, size);
    }
}


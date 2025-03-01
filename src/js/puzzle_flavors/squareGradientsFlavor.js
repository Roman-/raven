import {drawRandomLinearGradient} from "@/js/draw/drawingCommon";

export const squareGradientsFlavor = {
    name: 'Gradients',
    description: 'Direction and colorset',
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
        drawRandomLinearGradient(ctx, 0, 0, size, size, cell.palette)
    }
}
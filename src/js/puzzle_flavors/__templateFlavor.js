export const templateFlavor = {
    name: 'Template',
    description: 'description',
    isArtistic: true,
    getFeaturesVariations: () => {
        return {
            'feature1': [1, 2, 3],
        }
    },
    drawCell: (ctx, cell, size) => {
        drawThing(ctx, size);
    }
}

function drawThing(ctx, size) {
}

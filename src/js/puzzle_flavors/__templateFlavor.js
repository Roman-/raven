export const templateFlavor = {
    name: 'Template',
    description: 'description',
    isArtistic: true,
    getFeaturesVariations: () => {
        return {
            'feature1': [1, 2, 3],
        }
    },
    drawCell: (ctx, cell, size, rand) => {
        drawThing(ctx, size, rand);
    }
}

function drawThing(ctx, size, rand) {
}

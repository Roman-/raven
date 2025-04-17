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
        // cell.feature1 is an element from array that getFeaturesVariations() returns.
        // draw scene in ctx of size x size. If randomness is needed, call rand() to get number from 0 to 1
    }
}
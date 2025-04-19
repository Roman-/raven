export const templateFlavor = { // change the name accordingly
    name: 'Template',
    description: 'Short description of the scene and what features do change',
    isArtistic: false, // true for flavors that are truly generative art
    getFeaturesVariations: () => {
        return {
            'feature1': [1, 2, 3],
            'feature2': [
                ['#0F4C75', '#3282B8'],
                ['#8E1616', '#AE445A'],
                ['#626F47', '#A4B465'],
            ],
        }
    },
    drawCell: (ctx, cell, size, rand) => {
        // cell.feature1 is an element from array that getFeaturesVariations() returns.
        // draw scene in ctx of size x size. If randomness is needed, call rand() to get number from 0 to 1
    }
}

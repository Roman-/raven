export const letterFontFlavor = {
    name: 'LetterFont',
    description: 'One big letter with a random dark fill, black outline; letter and font vary.',
    isArtistic: false,
    getFeaturesVariations: () => ({
        letter: ['L', 'i', 'n'],
        fontBase: [
            "italic Npx 'Times New Roman', serif",
            "bold Npx 'Courier New', monospace",
            "lighter Npx Arial, sans-serif"
        ],
    }),
    drawCell: (ctx, cell, size, rand) => {
        const strokeWidth = size * 0.007;
        const fontSize = Math.floor(size * 0.7);

        ctx.clearRect(0, 0, size, size);

        const hue        = Math.floor(rand() * 360);
        const saturation = 60 + rand() * 10;
        const lightness  = 20 + rand() * 5;
        const fillColor  = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        ctx.font = cell.fontBase.replace('Npx', `${fontSize}px`);
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth    = strokeWidth;
        ctx.strokeStyle  = '#000';
        ctx.fillStyle    = fillColor;

        ctx.fillText(cell.letter, size / 2, size / 2);
        ctx.strokeText(cell.letter, size / 2, size / 2);
    }
};

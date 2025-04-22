export const letterFontFlavor = {
    name: 'LetterFont',
    description: 'One big letter with a random dark fill, black outline; letter and font vary.',
    isArtistic: false,
    getFeaturesVariations: () => ({
        letter: ['L', 'i', 'n'],
        font: [
            "italic 'Times New Roman', serif",
            "bold 'Courier New', monospace",
            "lighter Arial, sans-serif"
        ],
    }),
    drawCell: (ctx, cell, size, rand) => {
        // dark random color
        const hue        = Math.floor(rand() * 360);
        const saturation = 60 + rand() * 10;
        const lightness  = 20 + rand() * 5;
        const fillColor  = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

        // apply text style from cell.font
        const fontSize = Math.floor(size * 0.6);
        ctx.font         = `${fontSize}px ${cell.font}`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth    = '1';
        ctx.strokeStyle  = '#000';
        ctx.fillStyle    = fillColor;

        ctx.fillText(cell.letter, size / 2, size / 2);
        ctx.strokeText(cell.letter, size / 2, size / 2);
    }
};

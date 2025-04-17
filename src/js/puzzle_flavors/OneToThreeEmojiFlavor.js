import {emojiCategories} from "@/js/draw/drawingCommon";
import {randomElement} from "@/js/helpers";

export const oneToThreeEmojiFlavor = {
    name: 'One to three emoji',
    description: 'One, two or three emoji in a row',
    isArtistic: false,
    getFeaturesVariations: () => {
        return {
            'numEmoji': [1, 2, 3],
            'symbol': randomElement(emojiCategories)
        }
    },
    drawCell: (ctx, cell, size, rand) => {
        const centerX = size / 2;
        const centerY = size / 2;
        const fontSize = size * 0.3;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${fontSize}px sans-serif`;

        if (cell.numEmoji === 1) {
            ctx.fillText(cell.symbol, centerX, centerY);
        } else if (cell.numEmoji === 2) {
            const offset = size * 0.17;
            ctx.fillText(cell.symbol, centerX - offset, centerY);
            ctx.fillText(cell.symbol, centerX + offset, centerY);
        } else if (cell.numEmoji === 3) {
            const offset = size * 0.32;
            ctx.fillText(cell.symbol, centerX - offset, centerY);
            ctx.fillText(cell.symbol, centerX, centerY);
            ctx.fillText(cell.symbol, centerX + offset, centerY);
        }
    }
}

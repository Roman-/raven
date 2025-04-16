import {randomElement} from "@/js/helpers";
import {emojiCategories} from "@/js/draw/drawingCommon";

export const emojiFlavor = {
    name: 'Emojis',
    description: 'Emojis!',
    getFeaturesVariations: () => {
        return {
            'emoji': randomElement(emojiCategories),
        }
    },
    drawCell: (ctx, cell, size, rand) => {
        // emoji text inside the cell
        ctx.font = `${Math.floor(size * 0.6)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cell.emoji, size / 2, size / 2);
    }
}

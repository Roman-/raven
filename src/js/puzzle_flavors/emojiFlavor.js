import {randomElement} from "@/js/helpers";

export const emojiCategories = [
    ["🍎", "🍌", "🍇", "🍊", "🍉", "🍓", "🍒", "🍑", "🍍", "🥭", "🍏", "🍐", "🍋"],
    ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"],
    ["😀", "🤣", "🥰", "😍", "😋", "🤫", "😎", "😏", "😒", "🙄", "😬", "🤔", "😡", "👿", "💀", "💩"],
    ["🚗", "🚕", "🚙", "🚌", "🚎", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🚲", "🛴", "🛵", "🚃", "🚋", "🚝", "🚅", "🚂"],
    ["🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🍿", "🍣", "🍰", "🍩", "🍪", "🍦"],
    ["🌸", "🌻", "🍂", "🌳", "🌴", "🌵", "🌲", "🍄", "🌞", "🌜", "⭐", "⚡", "🔥", "🌈", "❄️", "💧", "🌪️"],
    ["🦋", "🐌", "🐛", "🐜", "🐝", "🐞", "🕷️", "🕸️", "🦂"],
];

export const emojiFlavor = {
    name: 'Emojis',
    description: 'Emojis!',
    getFeaturesVariations: () => {
        return {
            'emoji': randomElement(emojiCategories),
        }
    },
    drawCell: (ctx, cell, x, y, size) => {
        // emoji text inside the cell
        ctx.font = `${Math.floor(size * 0.6)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cell.emoji, x + size / 2, y + size / 2);
    }
}

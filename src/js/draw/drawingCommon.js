import {randomElement} from "@/js/helpers";

export function drawRegularPolygonPath(ctx, x, y, size, numSides, angleOffset = -Math.PI / 2) {
    const margin = size * 0.2
    size -= margin
    x += margin / 2
    y += margin / 2

    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const radius = size / 2; // Adjusted for better proportion

    for (let i = 0; i < numSides; i++) {
        const angle = i * (2 * Math.PI / numSides) + angleOffset;
        const px = centerX + radius * Math.cos(angle);
        const py = centerY + radius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
}

export function drawSquarePath(ctx, x, y, size) {
    const margin = size / 6
    ctx.rect(x + margin, y + margin, size - 2 * margin, size - 2 * margin)
}

export function drawCirclePath(ctx, x, y, size) {
    const centerX = x + size / 2
    const centerY = y + size / 2
    const radius = size / 3
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
}

export const drawRandomLinearGradient = (ctx, x, y, w, h, palette) => {
    const directions = {
        right: [x,     y,     x + w, y     ],
        down:  [x,     y,     x,     y + h ],
        diag1: [x,     y,     x + w, y + h ],
        diag2: [x + w, y,     x,     y + h ],
    };

    let [x1, y1, x2, y2] = randomElement(Object.values(directions));

    if (Math.random() < 0.5) {
        [x1, y1, x2, y2] = [x2, y2, x1, y1];
    }

    const grd = ctx.createLinearGradient(x1, y1, x2, y2);

    palette.forEach((color, index) => {
        grd.addColorStop(index / (palette.length - 1), color);
    });

    // Set fill style and draw
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, w, h);
};

export const emojiCategories = [
    ["🍎", "🍌", "🍇", "🍊", "🍉", "🍓", "🍒", "🍑", "🍍", "🥭", "🍏", "🍐", "🍋"],
    ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"],
    ["😀", "🤣", "🥰", "😍", "😋", "🤫", "😎", "😏", "😒", "🙄", "😬", "🤔", "😡", "👿", "💀", "💩"],
    ["🚗", "🚕", "🚙", "🚌", "🚎", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🚲", "🛴", "🛵", "🚃", "🚋", "🚝", "🚅", "🚂"],
    ["🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🍿", "🍣", "🍰", "🍩", "🍪", "🍦"],
    ["🌸", "🌻", "🍂", "🌳", "🌴", "🌵", "🌲", "🍄", "🌞", "🌜", "⭐", "⚡", "🔥", "🌈", "❄️", "💧", "🌪️"],
    ["🦋", "🐌", "🐛", "🐜", "🐝", "🐞", "🕷️", "🕸️", "🦂"],
];


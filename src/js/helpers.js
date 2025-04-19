// constrain x between min and max. Return value is in the interval [min, max]
export const clamp = (x, min, max) => {
    return Math.min(max, Math.max(x, min))
}

// download file with plain text in it
export const downloadPlainText = (text, fileName) => {
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', fileName)

    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

// shuffles array in place
export const shuffle = (a) => {
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
}

export const randomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

export const threeRandomElements = (array) => {
    if (array.length < 3) {
        throw new Error("threeRandomElements: array must have at least 3 elements, got " + JSON.stringify(array))
    }
    const copy = [...array];
    shuffle(copy);
    return copy.slice(0, 3);
}

// turn current <canvas> content into image
export const downloadCanvasAsPNG = (canvas, filename = "matrix.png") => {
    const link = document.createElement("a")
    link.download = filename
    link.href = canvas.toDataURL("image/png")
    link.click()
}

export const resetCanvasSettings = ctx => {
    ctx.strokeStyle = '#000000';  // Default: black
    ctx.fillStyle = '#000000';    // Default: black
    ctx.lineWidth = 1;            // Default: 1px
    ctx.lineCap = 'butt';         // Default: 'butt'
    ctx.lineJoin = 'miter';       // Default: 'miter'
    ctx.miterLimit = 10;          // Default: 10
    ctx.globalAlpha = 1.0;        // Default: fully opaque
    ctx.globalCompositeOperation = 'source-over'; // Default: normal drawing mode
    ctx.shadowColor = 'rgba(0,0,0,0)'; // Default: transparent
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.font = '10px sans-serif';  // Default: '10px sans-serif'
    ctx.textAlign = 'start';       // Default: 'start'
    ctx.textBaseline = 'alphabetic'; // Default: 'alphabetic'
    ctx.direction = 'ltr';         // Default: 'ltr'
    ctx.setLineDash([]);    // Default: solid line
    ctx.lineDashOffset = 0; // Default: 0px
}

export function seededRandom(seed) {
    let state = seed % 2147483647; // Use a prime number for better randomness
    if (state <= 0) state += 2147483646;
    return function() {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
}
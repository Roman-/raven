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

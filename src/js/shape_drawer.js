export class ShapeDrawer {

    /**
     * Draws the entire puzzle on the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {Number} startX - Top-left x-coordinate to start drawing the puzzle.
     * @param {Number} startY - Top-left y-coordinate to start drawing the puzzle.
     * @param {Number} puzzleSize - Total width/height allocated for the 3×3 puzzle.
     * @param {Array} puzzle - 3×3 array of cell objects to draw.
     */
    drawPuzzle(ctx, startX, startY, puzzleSize, puzzle) {
        const cellSize = puzzleSize / 3

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = puzzle[row][col]
                const cellX = startX + col * cellSize
                const cellY = startY + row * cellSize
                this.drawCell(ctx, cell, cellX, cellY, cellSize)
            }
        }
    }

    /**
     * Draws a single cell on the canvas based on the cell's feature data.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {Object} cell - A cell object with fields:
     *   { color, shape, lineThickness, lineColor, isAnswer }
     * @param {Number} x - Top-left x-coordinate of this cell.
     * @param {Number} y - Top-left y-coordinate of this cell.
     * @param {Number} size - The width/height of the cell (cellSize).
     */
    drawCell(ctx, cell, x, y, size) {
        ctx.save()

        // Draw a thin border for clarity (optional)
        ctx.lineWidth = 1
        ctx.strokeStyle = '#ccc'
        ctx.strokeRect(x, y, size, size)

        if (cell.isAnswer) {
            // Draw a question mark for the "question" cell
            this.drawQuestionMark(ctx, x, y, size)
        } else {
            // Otherwise draw the shape based on the cell's feature data
            // We'll interpret:
            // - cell.color for fill color
            // - cell.lineThickness for stroke width
            // - cell.lineColor for stroke color
            // - cell.shape for the geometry to draw

            // Set the stroke & fill styles from the cell's features
            ctx.fillStyle = cell.color || 'gray'
            ctx.lineWidth = cell.lineThickness || 1
            ctx.strokeStyle = cell.lineColor || 'black'

            // Begin drawing the shape
            ctx.beginPath()
            switch (cell.shape) {
                case 'circle':
                    this.drawCirclePath(ctx, x, y, size)
                    break
                case 'triangle':
                    this.drawTrianglePath(ctx, x, y, size)
                    break
                case 'square':
                    this.drawSquarePath(ctx, x, y, size)
                    break
                case 'pentagon':
                    this.drawPentagonPath(ctx, x, y, size)
                    break
                default:
                    // fallback: draw square if shape is unrecognized
                    this.drawSquarePath(ctx, x, y, size)
                    break
            }
            ctx.fill()
            ctx.stroke()
        }

        ctx.restore()
    }

    // ---- Helper shape-drawing paths ----

    /**
     * Draws a circle path centered in the cell.
     */
    drawCirclePath(ctx, x, y, size) {
        const centerX = x + size / 2
        const centerY = y + size / 2
        const radius = size / 3
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    }

    /**
     * Draws a triangle path inside the cell.
     */
    drawTrianglePath(ctx, x, y, size) {
        ctx.moveTo(x + size / 2, y + size / 6)            // top vertex
        ctx.lineTo(x + size / 6, y + (5 * size) / 6)      // bottom-left
        ctx.lineTo(x + (5 * size) / 6, y + (5 * size) / 6)// bottom-right
        ctx.closePath()
    }

    /**
     * Draws a square path in the cell.
     */
    drawSquarePath(ctx, x, y, size) {
        // Just an inset square for aesthetic
        const margin = size / 6
        ctx.rect(x + margin, y + margin, size - 2 * margin, size - 2 * margin)
    }

    /**
     * Draws a pentagon path centered in the cell.
     */
    drawPentagonPath(ctx, x, y, size) {
        // Basic approach: 5 points around a circle
        const centerX = x + size / 2
        const centerY = y + size / 2
        const radius = size / 3
        const sides = 5
        const angleStep = (2 * Math.PI) / sides
        ctx.moveTo(
            centerX + radius * Math.cos(0),
            centerY + radius * Math.sin(0)
        )
        for (let i = 1; i < sides; i++) {
            const angle = i * angleStep
            ctx.lineTo(
                centerX + radius * Math.cos(angle),
                centerY + radius * Math.sin(angle)
            )
        }
        ctx.closePath()
    }

    /**
     * Draws a question mark in the cell.
     * (For the puzzle cell that needs to be guessed.)
     */
    drawQuestionMark(ctx, x, y, size) {
        // Optionally draw a big "?" in the center:
        ctx.font = `${Math.floor(size * 0.6)}px sans-serif`
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('?', x + size / 2, y + size / 2)
    }
}

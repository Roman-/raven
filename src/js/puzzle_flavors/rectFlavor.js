export const rectFlavor = {
    name: 'Rect',
    description: 'white rectangle with random aspect‑ratio & border style',
    isArtistic: false,
    getFeaturesVariations: () => ({
        aspectRatio: [1/3, 1, 3],                         // width / height
        borderStyle: ['thin', 'mid‑dashed', 'thick'],     // line width & dash
    }),
    drawCell: (ctx, cell, size, rand) => {
        /* ---------- constants (fractions of size) ---------- */
        const MARGIN_F       = 0.08;          // outer margin
        const THIN_F         = 0.012;
        const MID_F          = 0.03;
        const THICK_F        = 0.06;
        /* ---------- compute geometry ---------- */
        const margin  = MARGIN_F * size;
        const lw      = cell.borderStyle === 'thin'        ? THIN_F  * size :
            cell.borderStyle === 'mid‑dashed'  ? MID_F   * size :
                THICK_F * size;
        const avail   = size - 2 * (margin + lw / 2);      // drawable square
        const ratio   = cell.aspectRatio;
        const w       = ratio >= 1 ? avail                 : avail * ratio;
        const h       = ratio >= 1 ? avail / ratio         : avail;
        const x       = (size - w) / 2;
        const y       = (size - h) / 2;
        /* ---------- style ---------- */
        ctx.fillStyle   = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth   = lw;
        ctx.setLineDash(cell.borderStyle === 'mid‑dashed' ? [lw*2, lw*2] : []);
        /* ---------- draw ---------- */
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
    }
};

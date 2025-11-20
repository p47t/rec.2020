const canvas = document.getElementById('chromaticityCanvas');
const ctx = canvas.getContext('2d');
const xyCoordsEl = document.getElementById('xyCoords');
const rgbRec2020El = document.getElementById('rgbRec2020');
const rgbSrgbEl = document.getElementById('rgbSrgb');
const colorPreviewEl = document.getElementById('colorPreview');
const statusMessageEl = document.getElementById('statusMessage');

// Rec.2020 Primaries and White Point
const rec2020 = {
    red: { x: 0.708, y: 0.292 },
    green: { x: 0.170, y: 0.797 },
    blue: { x: 0.131, y: 0.046 },
    white: { x: 0.3127, y: 0.3290 } // D65
};

// Simplified Spectral Locus Data (Approximate for visualization)
// In a real app, use a full high-res dataset.
const spectralLocus = [
    { wl: 380, x: 0.1741, y: 0.0050 }, { wl: 390, x: 0.1738, y: 0.0049 },
    { wl: 400, x: 0.1733, y: 0.0048 }, { wl: 410, x: 0.1726, y: 0.0048 },
    { wl: 420, x: 0.1714, y: 0.0051 }, { wl: 430, x: 0.1689, y: 0.0069 },
    { wl: 440, x: 0.1644, y: 0.0109 }, { wl: 450, x: 0.1566, y: 0.0177 },
    { wl: 460, x: 0.1440, y: 0.0297 }, { wl: 470, x: 0.1241, y: 0.0578 },
    { wl: 480, x: 0.0913, y: 0.1327 }, { wl: 490, x: 0.0454, y: 0.2950 },
    { wl: 500, x: 0.0082, y: 0.5384 }, { wl: 510, x: 0.0139, y: 0.7502 },
    { wl: 520, x: 0.0743, y: 0.8338 }, { wl: 530, x: 0.1547, y: 0.8059 },
    { wl: 540, x: 0.2296, y: 0.7543 }, { wl: 550, x: 0.3016, y: 0.6923 },
    { wl: 560, x: 0.3731, y: 0.6245 }, { wl: 570, x: 0.4441, y: 0.5547 },
    { wl: 580, x: 0.5125, y: 0.4866 }, { wl: 590, x: 0.5752, y: 0.4242 },
    { wl: 600, x: 0.6270, y: 0.3725 }, { wl: 610, x: 0.6658, y: 0.3340 },
    { wl: 620, x: 0.6915, y: 0.3083 }, { wl: 630, x: 0.7079, y: 0.2920 },
    { wl: 640, x: 0.7190, y: 0.2809 }, { wl: 650, x: 0.7260, y: 0.2740 },
    { wl: 660, x: 0.7300, y: 0.2700 }, { wl: 670, x: 0.7320, y: 0.2680 },
    { wl: 680, x: 0.7334, y: 0.2666 }, { wl: 700, x: 0.7347, y: 0.2653 },
    { wl: 780, x: 0.7347, y: 0.2653 }
];

// Drawing Constants
const PADDING = 50;
const SCALE = 900;
const OFFSET_X = 50;
const OFFSET_Y = 900;

function mapX(x) {
    return OFFSET_X + x * SCALE;
}

function mapY(y) {
    return OFFSET_Y - y * SCALE;
}

function unmapX(px) {
    return (px - OFFSET_X) / SCALE;
}

function unmapY(py) {
    return (OFFSET_Y - py) / SCALE;
}

function drawGrid() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    ctx.font = '10px Inter';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';

    // Vertical lines
    for (let x = 0; x <= 0.9; x += 0.1) {
        const px = mapX(x);
        ctx.beginPath();
        ctx.moveTo(px, mapY(0));
        ctx.lineTo(px, mapY(0.9));
        ctx.stroke();
        ctx.fillText(x.toFixed(1), px, mapY(-0.02));
    }

    // Horizontal lines
    ctx.textAlign = 'right';
    for (let y = 0; y <= 0.9; y += 0.1) {
        const py = mapY(y);
        ctx.beginPath();
        ctx.moveTo(mapX(0), py);
        ctx.lineTo(mapX(0.9), py);
        ctx.stroke();
        ctx.fillText(y.toFixed(1), mapX(-0.02), py + 3);
    }
}

function drawSpectralLocus() {
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;

    // Draw curve
    const first = spectralLocus[0];
    ctx.moveTo(mapX(first.x), mapY(first.y));

    for (let i = 1; i < spectralLocus.length; i++) {
        const p = spectralLocus[i];
        ctx.lineTo(mapX(p.x), mapY(p.y));
    }

    // Close the loop (Purple Line)
    ctx.lineTo(mapX(first.x), mapY(first.y));

    ctx.stroke();

    // Fill with a faint gradient or color to indicate the visible spectrum area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
}

function drawRec2020Triangle() {
    ctx.beginPath();
    ctx.strokeStyle = '#000000'; // Green for Rec.2020
    ctx.lineWidth = 2;

    ctx.moveTo(mapX(rec2020.red.x), mapY(rec2020.red.y));
    ctx.lineTo(mapX(rec2020.green.x), mapY(rec2020.green.y));
    ctx.lineTo(mapX(rec2020.blue.x), mapY(rec2020.blue.y));
    ctx.closePath();

    ctx.stroke();

    // Draw Primaries
    drawPoint(rec2020.red.x, rec2020.red.y, 'red', 'R');
    drawPoint(rec2020.green.x, rec2020.green.y, 'lime', 'G');
    drawPoint(rec2020.blue.x, rec2020.blue.y, 'blue', 'B');
    drawPoint(rec2020.white.x, rec2020.white.y, 'white', 'D65');
}

function drawPoint(x, y, color, label) {
    const px = mapX(x);
    const py = mapY(y);

    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Add stroke for visibility (especially for white point)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (label) {
        ctx.font = '12px Inter';

        // Add text outline for visibility
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeText(label, px + 8, py - 8);

        ctx.fillStyle = '#fff';
        ctx.fillText(label, px + 8, py - 8);
    }
}

// --- Color Fill Logic ---

function isPointInPolygon(point, vs) {
    // ray-casting algorithm based on
    // https://github.com/substack/point-in-polygon
    var x = point.x, y = point.y;
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function drawColorDiagram() {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Pre-calculate matrix for sRGB (Linear)
    // We use the same matrix as below, inlined or referenced.
    // Let's reference the one defined below (hoisting works for const? No, need to move definitions up or define here).
    // To be safe and clean, I'll define the matrix inside or move the global ones up.
    // Since I'm replacing the block *before* the global definitions, I should move them up or duplicate.
    // Actually, I will move the global definitions to the top of the file in a separate edit or just duplicate here for now to minimize diff noise, 
    // BUT wait, I am replacing `init()` which is at the end of the drawing section.
    // The global matrices are defined *after* `init()` in the previous file content.
    // I need to be careful.
    // Let's look at the file content again.
    // `init()` is called at the very end.
    // The matrices are defined *after* `drawRec2020Triangle`? No, looking at previous `replace_file_content` output (Step 35):
    // `init()` was at line 144.
    // Then I added `// --- Interaction & Color Logic ---` and the matrices.
    // So the matrices are *below* where I am inserting `drawColorDiagram`.
    // I should move the matrices up or define them inside.
    // I'll define a local version for the loop to ensure it works without reordering the whole file.

    const m = [
        [3.2404542, -1.5371385, -0.4985314],
        [-0.9692660, 1.8760108, 0.0415560],
        [0.0556434, -0.2040259, 1.0572252]
    ];

    for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
            const x = unmapX(px);
            const y = unmapY(py);

            // Optimization: Quick bounding box check for spectral locus
            // x in [0, 0.8], y in [0, 0.9] roughly
            if (x < 0 || x > 0.8 || y < 0 || y > 0.9) continue;

            if (isPointInPolygon({ x, y }, spectralLocus)) {
                // Convert xy -> XYZ (Y=1)
                // X = x/y, Z = (1-x-y)/y
                if (y <= 0) continue;

                let X = x / y;
                let Y = 1;
                let Z = (1 - x - y) / y;

                // XYZ -> Linear sRGB
                let r = m[0][0] * X + m[0][1] * Y + m[0][2] * Z;
                let g = m[1][0] * X + m[1][1] * Y + m[1][2] * Z;
                let b = m[2][0] * X + m[2][1] * Y + m[2][2] * Z;

                // Normalize to max component to maximize brightness
                const max = Math.max(r, g, b);
                if (max > 0) {
                    r /= max;
                    g /= max;
                    b /= max;
                }

                // Gamma Correct
                // Inline gamma correction for performance
                r = r <= 0.0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055;
                g = g <= 0.0031308 ? 12.92 * g : 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055;
                b = b <= 0.0031308 ? 12.92 * b : 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055;

                const index = (py * width + px) * 4;
                data[index] = Math.max(0, Math.min(255, Math.round(r * 255)));
                data[index + 1] = Math.max(0, Math.min(255, Math.round(g * 255)));
                data[index + 2] = Math.max(0, Math.min(255, Math.round(b * 255)));
                data[index + 3] = 255; // Alpha
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function init() {
    drawColorDiagram();
    drawGrid();
    drawSpectralLocus();
    drawRec2020Triangle();
}

// --- Interaction & Color Logic ---

// Matrix for XYZ to Linear sRGB (D65)
// Source: http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
const XYZ_to_sRGB_Matrix = [
    [3.2404542, -1.5371385, -0.4985314],
    [-0.9692660, 1.8760108, 0.0415560],
    [0.0556434, -0.2040259, 1.0572252]
];

// Matrix for XYZ to Linear Rec.2020
// Source: http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
const XYZ_to_Rec2020_Matrix = [
    [1.7166511, -0.3556707, -0.2533662],
    [-0.6666843, 1.6164812, 0.0157685],
    [0.0176398, -0.0427706, 0.9421031]
];

function multiplyMatrixVector(matrix, vector) {
    return [
        matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
        matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
        matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2]
    ];
}

function gammaCorrect(value) {
    // sRGB Gamma Correction
    if (value <= 0.0031308) {
        return 12.92 * value;
    } else {
        return 1.055 * Math.pow(value, 1.0 / 2.4) - 0.055;
    }
}

function xyToXYZ(x, y, Y = 1.0) {
    if (y === 0) return [0, 0, 0];
    const X = (x * Y) / y;
    const Z = ((1 - x - y) * Y) / y;
    return [X, Y, Z];
}

function updateColorDisplay(x, y) {
    // Update Coordinates
    xyCoordsEl.textContent = `x: ${x.toFixed(4)}, y: ${y.toFixed(4)}`;

    // Convert to XYZ (assume Y=0.5 for visualization brightness)
    const xyz = xyToXYZ(x, y, 0.5);

    // 1. XYZ -> Linear Rec.2020
    const linearRec2020 = multiplyMatrixVector(XYZ_to_Rec2020_Matrix, xyz);
    rgbRec2020El.textContent = `R: ${linearRec2020[0].toFixed(2)}, G: ${linearRec2020[1].toFixed(2)}, B: ${linearRec2020[2].toFixed(2)}`;

    // 2. XYZ -> Linear sRGB -> Gamma Corrected sRGB (for display)
    const linearSrgb = multiplyMatrixVector(XYZ_to_sRGB_Matrix, xyz);

    // Check if out of sRGB gamut
    let isOutOfGamut = false;
    const srgb = linearSrgb.map(v => {
        if (v < 0 || v > 1) isOutOfGamut = true;
        // Clamp for display
        const clamped = Math.max(0, Math.min(1, v));
        return Math.round(gammaCorrect(clamped) * 255);
    });

    rgbSrgbEl.textContent = `R: ${srgb[0]}, G: ${srgb[1]}, B: ${srgb[2]}`;

    const colorString = `rgb(${srgb[0]}, ${srgb[1]}, ${srgb[2]})`;
    colorPreviewEl.style.backgroundColor = colorString;
    colorPreviewEl.style.boxShadow = `0 0 20px ${colorString}`;

    if (isOutOfGamut) {
        statusMessageEl.textContent = "Color is outside sRGB gamut (Approximated)";
        statusMessageEl.style.color = "#ff6b6b";
    } else {
        statusMessageEl.textContent = "Color is within sRGB gamut";
        statusMessageEl.style.color = "#4ecdc4";
    }
}

// Check if point is inside triangle using barycentric coordinates
function isInsideTriangle(p, a, b, c) {
    const area = 0.5 * (-b.y * c.x + a.y * (-b.x + c.x) + a.x * (b.y - c.y) + b.x * c.y);
    const s = 1 / (2 * area) * (a.y * c.x - a.x * c.y + (c.y - a.y) * p.x + (a.x - c.x) * p.y);
    const t = 1 / (2 * area) * (a.x * b.y - a.y * b.x + (a.y - b.y) * p.x + (b.x - a.x) * p.y);
    return s > 0 && t > 0 && 1 - s - t > 0;
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const x = unmapX(px);
    const y = unmapY(py);

    // Check if inside Rec.2020 triangle
    const p = { x, y };
    // We allow clicking anywhere, but we can highlight if it's inside Rec.2020
    // The user request says "allow the user to click on any point in the triangle"
    // But usually it's nice to explore the whole locus.
    // Let's just update for any point, but maybe warn if outside Rec.2020?
    // For now, just update.

    updateColorDisplay(x, y);

    // Redraw to show selection marker
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    init();

    // Draw selection marker
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const x = unmapX(px);
    const y = unmapY(py);

    // Optional: Show coordinates on hover near cursor or just change cursor
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'block';
        tooltip.style.left = (e.clientX + 15) + 'px';
        tooltip.style.top = (e.clientY + 15) + 'px';
        tooltip.textContent = `x: ${x.toFixed(4)}, y: ${y.toFixed(4)}`;
    }
});

canvas.addEventListener('mouseleave', () => {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
});

init();

// Image processing utility functions
// Contains reusable functions for common image operations

class ImageProcessor {
    constructor() {
        this.luminanceWeights = [0.299, 0.587, 0.114];
    }

    // Calculate grayscale value using standard luminance formula
    calculateLuminance(r, g, b) {
        return this.luminanceWeights[0] * r + 
               this.luminanceWeights[1] * g + 
               this.luminanceWeights[2] * b;
    }

    // Clamp value between min and max
    clamp(value, min = 0, max = 255) {
        return Math.max(min, Math.min(max, value));
    }

    // Create new ImageData object with same dimensions as source
    createImageData(sourceData) {
        return new ImageData(sourceData.width, sourceData.height);
    }

    // Draw processed image to specified canvas slot
    drawToSlot(slotId, imageData) {
        const canvas = document.getElementById(slotId);
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.putImageData(imageData, 0, 0);
        }
    }
}

// RGB to HSV conversion
function rgbToHsv(r, g, b) {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h = 0;
    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h = h * 60;
    }
    
    const s = max === 0 ? 0 : delta / max;
    const v = max;
    
    return {
        h: h < 0 ? h + 360 : h,
        s: s * 100,
        v: v * 100
    };
}

// RGB to XYZ color space (for Lab conversion)
function rgbToXyz(r, g, b) {
    // Normalize and apply gamma correction
    let rNorm = r / 255;
    let gNorm = g / 255;  
    let bNorm = b / 255;
    
    // sRGB gamma correction
    rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
    gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
    bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;
    
    // Apply transformation matrix for D65 illuminant
    const x = rNorm * 0.4124564 + gNorm * 0.3575761 + bNorm * 0.1804375;
    const y = rNorm * 0.2126729 + gNorm * 0.7151522 + bNorm * 0.0721750;
    const z = rNorm * 0.0193339 + gNorm * 0.1191920 + bNorm * 0.9503041;
    
    return { x: x * 100, y: y * 100, z: z * 100 };
}

// XYZ to CIE Lab conversion
function xyzToLab(x, y, z) {
    const xn = 95.047, yn = 100.000, zn = 108.883; // D65 reference white
    
    let xr = x / xn;
    let yr = y / yn;
    let zr = z / zn;
    
    const delta = 6/29;
    const threshold = delta * delta * delta;
    
    function labTransform(t) {
        return t > threshold ? Math.pow(t, 1/3) : t / (3 * delta * delta) + 4/29;
    }
    
    const fx = labTransform(xr);
    const fy = labTransform(yr);
    const fz = labTransform(zr);
    
    const l = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const b = 200 * (fy - fz);
    
    return { l: l, a: a, b: b };
}
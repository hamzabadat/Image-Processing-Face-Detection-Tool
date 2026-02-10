// Color space visualization effects
// HSV and CIE Lab false-color representations

function applyHSVVisualization() {
    if (!baseImageData) return;
    
    const imgData = imageProcessor.createImageData(baseImageData);
    
    for (let i = 0; i < baseImageData.data.length; i += 4) {
        const r = baseImageData.data[i];
        const g = baseImageData.data[i + 1];
        const b = baseImageData.data[i + 2];
        
        const hsv = rgbToHsv(r, g, b);
        
        // Map HSV components to RGB channels for visualization
        imgData.data[i] = Math.round((hsv.h / 360) * 255);      // Hue -> Red
        imgData.data[i + 1] = Math.round((hsv.s / 100) * 255);  // Saturation -> Green
        imgData.data[i + 2] = Math.round((hsv.v / 100) * 255);  // Value -> Blue
        imgData.data[i + 3] = baseImageData.data[i + 3];
    }
    
    imageProcessor.drawToSlot("slot11", imgData);
}

function applyLabVisualization() {
    if (!baseImageData) return;
    
    const imgData = imageProcessor.createImageData(baseImageData);
    
    for (let i = 0; i < baseImageData.data.length; i += 4) {
        const r = baseImageData.data[i];
        const g = baseImageData.data[i + 1];
        const b = baseImageData.data[i + 2];
        
        // Convert RGB -> XYZ -> Lab
        const xyz = rgbToXyz(r, g, b);
        const lab = xyzToLab(xyz.x, xyz.y, xyz.z);
        
        // Map Lab components to RGB channels
        const newR = imageProcessor.clamp((lab.l / 100) * 255);
        const newG = imageProcessor.clamp(((lab.a + 128) / 256) * 255);
        const newB = imageProcessor.clamp(((lab.b + 128) / 256) * 255);
        
        imgData.data[i] = Math.round(newR);         // L* -> Red
        imgData.data[i + 1] = Math.round(newG);     // a* -> Green  
        imgData.data[i + 2] = Math.round(newB);     // b* -> Blue
        imgData.data[i + 3] = baseImageData.data[i + 3];
    }
    
    imageProcessor.drawToSlot("slot12", imgData);
}
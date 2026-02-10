// Basic image effects for the webcam processing application
// Contains grayscale, X-ray filter, and RGB channel isolation effects

const imageProcessor = new ImageProcessor();

// Grayscale conversion with brightness enhancement
function applyGrayscale() {
    if (!baseImageData) return;
    
    const imgData = imageProcessor.createImageData(baseImageData);
    const brightnessBoost = 1.2;
    
    for (let i = 0; i < baseImageData.data.length; i += 4) {
        const gray = imageProcessor.calculateLuminance(
            baseImageData.data[i], 
            baseImageData.data[i + 1], 
            baseImageData.data[i + 2]
        );
        
        const brightGray = imageProcessor.clamp(gray * brightnessBoost);
        
        imgData.data[i] = brightGray;
        imgData.data[i + 1] = brightGray;
        imgData.data[i + 2] = brightGray;
        imgData.data[i + 3] = baseImageData.data[i + 3];
    }
    
    imageProcessor.drawToSlot("slot2", imgData);
}

// X-ray effect with contrast enhancement and blue tint
function applyXRayFilter() {
    if (!baseImageData) return;
    
    const imgData = imageProcessor.createImageData(baseImageData);
    
    for (let i = 0; i < baseImageData.data.length; i += 4) {
        const r = baseImageData.data[i];
        const g = baseImageData.data[i + 1];
        const b = baseImageData.data[i + 2];
        
        // Convert to grayscale
        let gray = imageProcessor.calculateLuminance(r, g, b);
        
        // Enhance contrast
        gray = enhanceContrast(gray, 1.5);
        
        // Invert for X-ray appearance
        const inverted = 255 - gray;
        
        // Add noise texture
        const noise = (Math.random() - 0.5) * 8;
        const noisyValue = imageProcessor.clamp(inverted + noise);
        
        // Apply blue tint characteristic of X-rays
        imgData.data[i] = Math.round(noisyValue * 0.7);
        imgData.data[i + 1] = Math.round(noisyValue * 0.8);
        imgData.data[i + 2] = noisyValue;
        imgData.data[i + 3] = baseImageData.data[i + 3];
    }
    
    imageProcessor.drawToSlot("slot3", imgData);
}

// Helper function for contrast enhancement
function enhanceContrast(value, factor) {
    const normalized = value / 255;
    let enhanced;
    
    if (normalized > 0.5) {
        enhanced = Math.pow(normalized, 1 / factor);
    } else {
        enhanced = Math.pow(normalized, factor);
    }
    
    return imageProcessor.clamp(enhanced * 255);
}

// RGB channel isolation effects
function applyRed() {
    applyChannelIsolation("slot4", 0); // Red channel
}

function applyGreen() {
    applyChannelIsolation("slot5", 1); // Green channel
}

function applyBlue() {
    applyChannelIsolation("slot6", 2); // Blue channel
}

// Generic channel isolation function
function applyChannelIsolation(slotId, channelIndex) {
    if (!baseImageData) return;
    
    const imgData = imageProcessor.createImageData(baseImageData);
    
    for (let i = 0; i < baseImageData.data.length; i += 4) {
        // Zero out all channels
        imgData.data[i] = 0;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        
        // Keep only the specified channel
        imgData.data[i + channelIndex] = baseImageData.data[i + channelIndex];
        imgData.data[i + 3] = baseImageData.data[i + 3];
    }
    
    imageProcessor.drawToSlot(slotId, imgData);
}
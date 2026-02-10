// Threshold effects with slider controls
// Handles binary thresholding for RGB channels and color spaces

class ThresholdController {
    constructor(slotNumber, channelIndex = null) {
        this.slotNumber = slotNumber;
        this.channelIndex = channelIndex;
        this.slider = document.getElementById(`slider${slotNumber}`);
        this.valueDisplay = document.getElementById(`value${slotNumber}`);
        
        this.setupEventListener();
    }
    
    setupEventListener() {
        this.slider.addEventListener('input', () => {
            this.valueDisplay.textContent = this.slider.value;
            if (baseImageData) {
                this.applyThreshold();
            }
        });
    }
    
    applyThreshold() {
        const threshold = parseInt(this.slider.value);
        const slotId = `slot${this.slotNumber}`;
        
        if (this.channelIndex !== null) {
            this.applyChannelThreshold(slotId, threshold);
        } else if (this.slotNumber === 14) {
            this.applyColorSpaceThreshold(slotId, threshold, "slot11");
        } else if (this.slotNumber === 15) {
            this.applyColorSpaceThreshold(slotId, threshold, "slot12");
        }
    }
    
    applyChannelThreshold(slotId, threshold) {
        if (!baseImageData) return;
        
        const imgData = imageProcessor.createImageData(baseImageData);
        
        for (let i = 0; i < baseImageData.data.length; i += 4) {
            const channelValue = baseImageData.data[i + this.channelIndex];
            const binary = channelValue > threshold ? 255 : 0;
            
            imgData.data[i] = binary;
            imgData.data[i + 1] = binary;
            imgData.data[i + 2] = binary;
            imgData.data[i + 3] = baseImageData.data[i + 3];
        }
        
        imageProcessor.drawToSlot(slotId, imgData);
    }
    
    applyColorSpaceThreshold(slotId, threshold, sourceSlotId) {
        const sourceCanvas = document.getElementById(sourceSlotId);
        if (!sourceCanvas) return;
        
        const sourceCtx = sourceCanvas.getContext("2d", {willReadFrequently: true});
        const sourceData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        
        const imgData = imageProcessor.createImageData(baseImageData);
        
        for (let i = 0; i < sourceData.data.length; i += 4) {
            const gray = imageProcessor.calculateLuminance(
                sourceData.data[i],
                sourceData.data[i + 1],
                sourceData.data[i + 2]
            );
            
            const binary = gray > threshold ? 255 : 0;
            
            imgData.data[i] = binary;
            imgData.data[i + 1] = binary;
            imgData.data[i + 2] = binary;
            imgData.data[i + 3] = sourceData.data[i + 3];
        }
        
        imageProcessor.drawToSlot(slotId, imgData);
    }
}

// Initialize threshold controllers
let thresholdControllers = [];

document.addEventListener('DOMContentLoaded', function() {
    // RGB channel thresholds
    thresholdControllers.push(new ThresholdController(7, 0)); // Red
    thresholdControllers.push(new ThresholdController(8, 1)); // Green
    thresholdControllers.push(new ThresholdController(9, 2)); // Blue
    
    // Color space thresholds
    thresholdControllers.push(new ThresholdController(14)); // HSV
    thresholdControllers.push(new ThresholdController(15)); // Lab
});

// Individual threshold functions for compatibility
function applyThreshold7() {
    thresholdControllers[0].applyThreshold();
}

function applyThreshold8() {
    thresholdControllers[1].applyThreshold();
}

function applyThreshold9() {
    thresholdControllers[2].applyThreshold();
}

function applyThreshold14() {
    if (thresholdControllers[3]) {
        thresholdControllers[3].applyThreshold();
    }
}

function applyThreshold15() {
    if (thresholdControllers[4]) {
        thresholdControllers[4].applyThreshold();
    }
}
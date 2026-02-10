// Face detection with modification effects
// Uses ml5.js FaceApi for detection and applies various visual effects

class FaceDetector {
    constructor() {
        this.faceApi = null;
        this.modelLoaded = false;
        this.detectedFaces = [];
        this.currentMode = 0; // 0=normal, 1=grayscale, 2=blur, 3=HSV, 4=pixelate
        
        this.initializeModel();
        this.setupControls();
    }
    
    initializeModel() {
        const options = {
            withLandmarks: true,
            withExpressions: false,
            withDescriptors: false,
            minConfidence: 0.5
        };
        
        this.faceApi = ml5.faceApi(options, () => {
            this.modelLoaded = true;
        });
    }
    
    setupControls() {
        document.addEventListener('keydown', (event) => {
            if (!this.detectedFaces.length || !baseImageData) return;
            
            const keyModes = {'1': 1, '2': 2, '3': 3, '4': 4, '5': 0};
            if (event.key in keyModes) {
                this.currentMode = keyModes[event.key];
                this.processDetection();
            }
        });
    }
    
    detect() {
        if (!baseImageData || !this.modelLoaded) {
            this.showLoadingMessage();
            return;
        }
        
        // Create temporary canvas for ml5 processing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = baseImageData.width;
        tempCanvas.height = baseImageData.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(baseImageData, 0, 0);
        
        this.faceApi.detect(tempCanvas, (error, results) => {
            if (error) {
                this.showErrorMessage();
                return;
            }
            
            this.detectedFaces = results || [];
            this.processDetection();
        });
    }
    
    processDetection() {
        const canvas = document.getElementById("slot13");
        const ctx = canvas.getContext("2d");
        
        // Start with original image
        const modifiedImageData = new ImageData(
            new Uint8ClampedArray(baseImageData.data),
            baseImageData.width,
            baseImageData.height
        );
        
        if (this.detectedFaces.length > 0) {
            if (this.currentMode > 0) {
                this.applyFaceModifications(modifiedImageData);
            }
            ctx.putImageData(modifiedImageData, 0, 0);
            
            // Draw bounding boxes if in normal mode
            if (this.currentMode === 0) {
                this.drawBoundingBoxes(ctx);
            }
        } else {
            ctx.putImageData(modifiedImageData, 0, 0);
            this.showNoFacesMessage(ctx);
        }
    }
    
    applyFaceModifications(imageData) {
        this.detectedFaces.forEach(detection => {
            if (!detection.alignedRect || !detection.alignedRect._box) return;
            
            const box = detection.alignedRect._box;
            const x = Math.floor(box._x);
            const y = Math.floor(box._y);
            const width = Math.floor(box._width);
            const height = Math.floor(box._height);
            
            switch(this.currentMode) {
                case 1: this.applyGrayscaleToFace(imageData, x, y, width, height); break;
                case 2: this.applyBlurToFace(imageData, x, y, width, height); break;
                case 3: this.applyHSVToFace(imageData, x, y, width, height); break;
                case 4: this.applyPixelationToFace(imageData, x, y, width, height); break;
            }
        });
    }
    
    applyGrayscaleToFace(imageData, x, y, width, height) {
        for (let py = y; py < y + height && py < imageData.height; py++) {
            for (let px = x; px < x + width && px < imageData.width; px++) {
                const i = (py * imageData.width + px) * 4;
                const gray = imageProcessor.calculateLuminance(
                    imageData.data[i], 
                    imageData.data[i + 1], 
                    imageData.data[i + 2]
                );
                
                imageData.data[i] = gray;
                imageData.data[i + 1] = gray;
                imageData.data[i + 2] = gray;
            }
        }
    }
    
    applyBlurToFace(imageData, x, y, width, height) {
        const blurRadius = 3;
        const tempData = new Uint8ClampedArray(imageData.data);
        
        for (let py = y; py < y + height && py < imageData.height; py++) {
            for (let px = x; px < x + width && px < imageData.width; px++) {
                let r = 0, g = 0, b = 0, count = 0;
                
                for (let by = py - blurRadius; by <= py + blurRadius; by++) {
                    for (let bx = px - blurRadius; bx <= px + blurRadius; bx++) {
                        if (this.isInBounds(bx, by, x, y, width, height, imageData)) {
                            const bi = (by * imageData.width + bx) * 4;
                            r += tempData[bi];
                            g += tempData[bi + 1];
                            b += tempData[bi + 2];
                            count++;
                        }
                    }
                }
                
                if (count > 0) {
                    const i = (py * imageData.width + px) * 4;
                    imageData.data[i] = r / count;
                    imageData.data[i + 1] = g / count;
                    imageData.data[i + 2] = b / count;
                }
            }
        }
    }
    
    applyHSVToFace(imageData, x, y, width, height) {
        for (let py = y; py < y + height && py < imageData.height; py++) {
            for (let px = x; px < x + width && px < imageData.width; px++) {
                const i = (py * imageData.width + px) * 4;
                const hsv = rgbToHsv(
                    imageData.data[i],
                    imageData.data[i + 1],
                    imageData.data[i + 2]
                );
                
                imageData.data[i] = Math.round((hsv.h / 360) * 255);
                imageData.data[i + 1] = Math.round((hsv.s / 100) * 255);
                imageData.data[i + 2] = Math.round((hsv.v / 100) * 255);
            }
        }
    }
    
    applyPixelationToFace(imageData, x, y, width, height) {
        const blockSize = 5;
        
        // First convert to grayscale
        this.applyGrayscaleToFace(imageData, x, y, width, height);
        
        // Then pixelate
        for (let py = y; py < y + height; py += blockSize) {
            for (let px = x; px < x + width; px += blockSize) {
                let totalIntensity = 0;
                let pixelCount = 0;
                
                // Calculate average for block
                for (let by = py; by < py + blockSize && by < y + height && by < imageData.height; by++) {
                    for (let bx = px; bx < px + blockSize && bx < x + width && bx < imageData.width; bx++) {
                        const i = (by * imageData.width + bx) * 4;
                        totalIntensity += imageData.data[i];
                        pixelCount++;
                    }
                }
                
                const avgIntensity = pixelCount > 0 ? totalIntensity / pixelCount : 0;
                
                // Apply average to all pixels in block
                for (let by = py; by < py + blockSize && by < y + height && by < imageData.height; by++) {
                    for (let bx = px; bx < px + blockSize && bx < x + width && bx < imageData.width; bx++) {
                        const i = (by * imageData.width + bx) * 4;
                        imageData.data[i] = avgIntensity;
                        imageData.data[i + 1] = avgIntensity;
                        imageData.data[i + 2] = avgIntensity;
                    }
                }
            }
        }
    }
    
    isInBounds(x, y, faceX, faceY, faceWidth, faceHeight, imageData) {
        return x >= faceX && x < faceX + faceWidth && 
               y >= faceY && y < faceY + faceHeight &&
               x >= 0 && x < imageData.width && 
               y >= 0 && y < imageData.height;
    }
    
    drawBoundingBoxes(ctx) {
        ctx.save();
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        
        this.detectedFaces.forEach(detection => {
            if (!detection.alignedRect || !detection.alignedRect._box) return;
            
            const box = detection.alignedRect._box;
            ctx.fillRect(box._x, box._y, box._width, box._height);
            ctx.strokeRect(box._x, box._y, box._width, box._height);
        });
        
        ctx.restore();
    }
    
    showLoadingMessage() {
        const canvas = document.getElementById("slot13");
        const ctx = canvas.getContext("2d");
        
        ctx.putImageData(baseImageData, 0, 0);
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading Face Detection...', canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
    
    showErrorMessage() {
        const canvas = document.getElementById("slot13");
        const ctx = canvas.getContext("2d");
        
        ctx.putImageData(baseImageData, 0, 0);
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Face Detection Error', canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }
    
    showNoFacesMessage(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
        ctx.fillRect(5, 5, 100, 30);
        
        ctx.fillStyle = '#000000';
        ctx.font = '10px Arial';
        ctx.fillText('No faces detected', 10, 20);
        ctx.restore();
    }
}

// Initialize face detector
let faceDetector;

document.addEventListener('DOMContentLoaded', function() {
    faceDetector = new FaceDetector();
});

// Main function called from snapshot capture
function applyFaceDetection() {
    if (faceDetector) {
        faceDetector.detect();
    }
}
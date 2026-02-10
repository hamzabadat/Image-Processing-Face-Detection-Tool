/* 
=========================== Webcam Image Processing Project Report =================================================
FINDINGS
The image thresholding experiments revealed interesting characteristics. 
Red channel thresholding was effective at isolating skin tones and warm objects, 
creating clear binary masks that highlighted human subjects in the webcam feed. This made sense given 
that skin typically has high red channel values. Green channel thresholding worked well for detecting 
vegetation and mid-tone objects, often producing cleaner separations than other channels when natural 
elements were present in the scene. Blue channel thresholding captured cooler tones and shadow regions 
effectively, though it was generally noisier due to the lower signal-to-noise ratio in the blue channel 
of most webcam sensors.

The RGB channel isolations provided clear visual feedback about how different wavelengths contribute to 
the overall image. When comparing the individual channel outputs, it became apparent that the green channel 
typically contained the most structural information.

The HSV and CIE Lab false-color visualizations produced more complex results. While visually striking, 
their thresholded outputs were considerably noisier and more fragmented compared to direct RGB channel thresholding. 
This occurred because the thresholding was applied to arbitrary false-color representations rather than meaningful 
perceptual values.
----------------------------------------------------------------------------------------------------------------------
CHALLENGES AND SOLUTIONS
The most significant challenges involved implementing the HSV and CIE Lab* color space visualizations. 
These required extensive mathematical transformations involving gamma correction, matrix operations, 
and complex color space conversions. The sheer volume of numerical calculations and parameter adjustments 
made debugging difficult, I spent considerable time ensuring the RGB to XYZ to Lab transformation chain 
was mathematically correct, often getting lost in the conversion formulas.

Face detection presented additional complications, requiring integration of the ml5.js library and careful handling 
of asynchronous model loading. Initial attempts resulted in timing issues and model initialization failures that 
required implementing proper callback systems and error handling.
-----------------------------------------------------------------------------------------------------------------------
PROJECT COMPLETION ASSESSMENT
I was not on target to successfully complete the project as originally planned. The complexity 
of the color space implementations consumed significantly more development time than anticipated, 
forcing me to redirect time allocated for my extension toward completing the basic requirements.

For future iterations, I would approach the color space visualizations differently by seeking 
simpler implementation methods or using established libraries rather than implementing all 
transformations from scratch. The mathematical complexity, proved unnecessarily 
time-consuming for the project's scope. Pre-built color space conversion functions will allow 
more time for creative extensions and refinement of the core functionality.
--------------------------------------------------------------------------------------------------------------------------
EXTENSION: X-RAY FILTER
The X-ray filter extension, while simple due to time constraints, represents a unique approach 
to medical imaging simulation in web-based applications. Unlike typical Instagram-style filters, 
this filter recreates the specific visual characteristics 
of medical X-ray imaging: inverted luminance values, blue-white coloration, contrast enhancement 
for bone-like structures, and subtle noise injection for texture authenticity.

This extension is unique because it bridges medical imaging concepts with accessible web technology, 
potentially serving educational purposes for students learning about medical imaging or radiology. 
The filter's emphasis on contrast inversion and structural emphasis mimics how X-ray images highlight 
density differences in human anatomy, thus a valuable tool for understanding medical imaging 
principles rather than entertainment. 
=========================================================================================================================
*/

// Global variables
let baseImageData = null;
let video, snapBtn, downloadLink, hiddenCanvas, ctx;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupWebcam();
    setupEventListeners();
});

function initializeElements() {
    video = document.getElementById('video');
    snapBtn = document.getElementById('snap');
    downloadLink = document.getElementById('download');
    hiddenCanvas = document.getElementById('canvas');
    ctx = hiddenCanvas.getContext('2d', {willReadFrequently: true});
}

function setupWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) { 
            video.srcObject = stream;
        })
        .catch(function(err) { 
            alert("Webcam access failed: " + err.message);
        });
}

function setupEventListeners() {
    snapBtn.addEventListener('click', captureSnapshot);
}

function captureSnapshot() {
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, 160, 120);
    
    // Set up download link
    const dataURL = hiddenCanvas.toDataURL("image/png");
    downloadLink.href = dataURL;

    // Get pixel data for processing
    baseImageData = ctx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);

    // Fill all slots with original image first
    fillOriginalSlots();
    
    // Apply effects to specific slots
    applyAllEffects();
}

function fillOriginalSlots() {
    for (let i = 1; i <= 15; i++) {
        const canvas = document.getElementById("slot" + i);
        if (canvas) {
            const canvasCtx = canvas.getContext("2d");
            canvasCtx.putImageData(baseImageData, 0, 0);
        }
    }
}

function applyAllEffects() {
    // Basic effects
    applyGrayscale();
    applyXRayFilter();
    
    // RGB channel separations
    applyRed();
    applyGreen();
    applyBlue();
    
    // Threshold effects
    applyThreshold7();
    applyThreshold8();
    applyThreshold9();
    
    // Color space visualizations
    applyHSVVisualization();
    applyLabVisualization();
    
    // Advanced effects
    applyFaceDetection();
    applyThreshold14();
    applyThreshold15();
}
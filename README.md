# 📷 Webcam Image Processing & Face Detection Tool

A browser-based **image processing and computer vision project** that captures webcam snapshots and applies multiple visual effects, thresholding experiments, color space visualizations, and **face detection**.

This project demonstrates fundamental image processing concepts such as grayscale conversion, channel separation, binary thresholding, and color space transformation (HSV and CIE Lab), along with face detection using **ml5.js FaceAPI**.

---

## 🚀 Features

### 🖼️ Image Effects
- Grayscale conversion (with brightness boost)
- X-Ray style filter (inversion + contrast + blue tint + noise)
- RGB channel isolation (Red / Green / Blue)

### 🎚️ Thresholding Tools (Interactive Sliders)
- Red threshold mask
- Green threshold mask
- Blue threshold mask
- HSV threshold mask
- Lab threshold mask

### 🌈 Color Space Visualizations
- HSV false-color visualization
- CIE Lab false-color visualization

### 🙂 Face Detection (ml5.js)
- Detects faces and draws bounding boxes
- Allows applying effects directly to detected face regions:
  - Grayscale
  - Blur
  - HSV visualization
  - Pixelation

---

## 🎮 Face Detection Controls

After capturing a snapshot, press:

| Key | Effect |
|-----|--------|
| 1   | Grayscale face |
| 2   | Blur face |
| 3   | HSV visualization on face |
| 4   | Pixelation effect |
| 5   | Reset to normal bounding box mode |

---

## 🛠️ Technologies Used
- **HTML5 Canvas**
- **JavaScript**
- **CSS**
- **p5.js**
- **ml5.js FaceAPI**

---

## 📂 Project Structure
index.html → Main webpage UI
style.css → Styling and layout
main.js → Webcam capture + pipeline execution
imageUtils.js → Utility functions + color conversions
basicEffects.js → Grayscale, X-Ray, RGB channel effects
thresholdEffects.js → Slider threshold system
colorSpaceEffects.js → HSV + Lab visualizations
faceDetection.js → Face detection + face modifications

## ▶️ How to Run the Project

### Option 1: Run Locally
1. Download or clone this repository
2. Open `index.html` in your browser
3. Allow webcam permissions
4. Click **📸 Capture Image** to generate the processed outputs

### Option 2 (Recommended): Run Using VS Code Live Server
Some browsers restrict webcam features when opening files directly.

1. Install **VS Code**
2. Install the extension: **Live Server**
3. Right-click `index.html`
4. Select **Open with Live Server**

---

## 💾 Saving Your Snapshot
After capturing an image, click:

**💾 Save Image**

This downloads the captured frame as a `.png`.

---

## 📌 Notes
- Face detection depends on the **ml5.js model**, which may take a moment to load.
- If the model is still loading, a message will appear inside the face detection slot.

---

## 🧠 What This Project Demonstrates
This project was built to explore and practice:
- Pixel-level image manipulation
- RGB channel separation
- Binary thresholding techniques
- Color space conversions (RGB → HSV, RGB → XYZ → Lab)
- Real-time face detection and region-based filtering

---

## 💡 Possible Future Improvements
- Add edge detection (Sobel / Canny)
- Add background removal using segmentation
- Allow uploading images instead of webcam only
- Add multi-face tracking improvements
- Add UI dropdown for face effect selection

---

## 👨‍💻 Author
**Hamza Badat**  
Computer Science student exploring image processing and computer vision through creative coding.

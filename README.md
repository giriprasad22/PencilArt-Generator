# PencilArt-Generator

## About the Project
- PencilArt-Generator is a responsive web app that converts photos into realistic pencil sketches using client-side image processing and canvas techniques.

- The project is ideal for artists, hobbyists, and content creators who want quick, stylized pencil-art exports from their photos.

- Built with accessibility and performance in mind so users on low-end devices can still get smooth results.

## Features
- Responsive, mobile-first UI for quick image uploads and previews.

- Real-time pencil sketch conversion with adjustable controls (stroke intensity, contrast, shading).

- Upload, drag-and-drop support and live preview on an HTML5 canvas.

- Downloadable high-resolution pencil sketch output (PNG).

- Optional background removal and border/frame presets for finished artwork.

- Lightweight JavaScript-only implementation — no backend required for basic usage.

- Accessible UI with keyboard support and ARIA attributes.

- Smooth micro-interactions and subtle animations for a modern experience.

## Technologies Used
- HTML5 & CSS3

- Tailwind CSS (optional utility classes)

- Vanilla JavaScript (Canvas API)

- Optional: p5.js / CamanJS (for advanced filters)

- FileSaver.js (for client-side downloads)

- Bootstrap Icons (for UI icons)

## Getting Started
### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Installation
- Clone the repo:
- git clone https://github.com/giriprasad22/PencilArt-Generator.git

- Navigate to the project folder:
- cd PencilArt-Generator

- Open index.html in your browser to run the app locally.

- No build step or server required — fully static and client-side by default.

## Usage
- Open index.html and either click the upload button or drag-and-drop an image into the canvas area.

- Use the available sliders to tweak stroke intensity, contrast, and shading until you achieve the desired pencil effect.

- Preview updates in real-time; click "Download" to save the generated sketch as a PNG.

- For integration with a backend (optional): send the original image to a server for server-side processing, or persist user-created sketches.

## Customization
- Edit index.html and script.js to change default filter values or add new presets.

- Replace Tailwind utility classes or add a Tailwind config if you prefer a build step for custom styling.

- Extend the sketch pipeline by adding a noise layer, paper texture overlay, or multi-pass shading.

## Accessibility & Performance
- Semantic HTML and ARIA roles ensure the app is usable by screen readers.

- Keyboard-accessible controls and focus states for all interactive elements.

- Performance-optimized image resizing before processing to keep CPU usage low on mobile.

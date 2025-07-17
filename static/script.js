document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadSection = document.getElementById('uploadSection');
    const processingSection = document.getElementById('processingSection');
    const resultSection = document.getElementById('resultSection');
    const imageInput = document.getElementById('imageInput');
    const browseBtn = document.getElementById('browseBtn');
    const originalImage = document.getElementById('originalImage');
    const resultImage = document.getElementById('resultImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const newBtn = document.getElementById('newBtn');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    // Initialize particles.js background
    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#6c5ce7" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#a29bfe", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            }
        });
    }

    // Event Listeners
    browseBtn.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', handleImageUpload);
    newBtn.addEventListener('click', resetApp);
    downloadBtn.addEventListener('click', downloadResult);

    // Drag and Drop functionality
    const uploadCard = document.querySelector('.upload-card');
    uploadCard.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadCard.style.border = '2px dashed var(--primary)';
        uploadCard.style.backgroundColor = 'rgba(108, 92, 231, 0.05)';
    });

    uploadCard.addEventListener('dragleave', () => {
        uploadCard.style.border = '2px dashed var(--primary-light)';
        uploadCard.style.backgroundColor = 'white';
    });

    uploadCard.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadCard.style.border = '2px dashed var(--primary-light)';
        uploadCard.style.backgroundColor = 'white';
        
        if (e.dataTransfer.files.length) {
            imageInput.files = e.dataTransfer.files;
            handleImageUpload();
        }
    });

    // Functions
    function handleImageUpload() {
        const file = imageInput.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, or WEBP)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image size should be less than 10MB');
            return;
        }

        // Show original image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Show processing section
        uploadSection.style.display = 'none';
        processingSection.style.display = 'flex';
        resultSection.style.display = 'none';

        // Simulate processing animation
        simulateProcessing(file);
    }

    function simulateProcessing(file) {
        let progress = 0;
        const processingInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 90) progress = 90; // Leave 10% for actual processing
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%`;
            
            if (progress === 90) {
                clearInterval(processingInterval);
                
                // Create FormData and send to backend
                const formData = new FormData();
                formData.append('image', file);

                fetch('/process', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Update progress to 100%
                        progressBar.style.width = '100%';
                        progressText.textContent = '100%';
                        
                        // Set the sketch image from the backend response
                        resultImage.src = data.sketch_url;
                        
                        // Show result section
                        setTimeout(() => {
                            processingSection.style.display = 'none';
                            resultSection.style.display = 'block';
                        }, 500);
                    } else {
                        alert('Error processing image: ' + data.error);
                        resetApp();
                    }
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                    resetApp();
                });
            }
        }, 200);
    }

    function downloadResult() {
        if (!resultImage.src) return;
        
        const a = document.createElement('a');
        a.href = resultImage.src;
        a.download = `sketch_${imageInput.files[0].name.split('.')[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function resetApp() {
        imageInput.value = '';
        uploadSection.style.display = 'block';
        processingSection.style.display = 'none';
        resultSection.style.display = 'none';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
    }
});
from flask import Flask, render_template, request, jsonify
import cv2
import os
from werkzeug.utils import secure_filename
import uuid
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/process": {"origins": "*"},
    r"/static/uploads/*": {"origins": "*"}
}) # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_to_sketch(image_path):
    try:
        # Read the image
        image = cv2.imread(image_path)
        if image is None:
            return None, "Could not read the image"

        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Invert the grayscale image
        inverted = cv2.bitwise_not(gray)

        # Apply Gaussian blur
        blurred = cv2.GaussianBlur(inverted, (21, 21), 0)

        # Invert the blurred image
        inverted_blurred = cv2.bitwise_not(blurred)

        # Create sketch effect
        sketch = cv2.divide(gray, inverted_blurred, scale=256.0)

        return sketch, None
    except Exception as e:
        return None, str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'})

    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'})

    if file and allowed_file(file.filename):
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_id = str(uuid.uuid4())[:8]
        original_path = os.path.join(app.config['UPLOAD_FOLDER'], f'original_{unique_id}_{filename}')
        sketch_path = os.path.join(app.config['UPLOAD_FOLDER'], f'sketch_{unique_id}_{filename}')

        # Save original file
        file.save(original_path)

        # Convert to sketch
        sketch, error = convert_to_sketch(original_path)
        if error:
            return jsonify({'success': False, 'error': error})

        # Save sketch
        cv2.imwrite(sketch_path, sketch)

        # Return sketch URL
        sketch_url = f"/{sketch_path}"
        return jsonify({
            'success': True,
            'sketch_url': sketch_url
        })

    return jsonify({'success': False, 'error': 'Invalid file type'})

if __name__ == '__main__':
    app.run(debug=True)

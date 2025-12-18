from flask import Flask, request, jsonify, render_template
import numpy as np
from tensorflow import keras
from PIL import Image, ImageFilter
from PIL.Image import Resampling

app = Flask(__name__)

model = keras.models.load_model("model_cnn.h5")

def preprocess_for_mnist(img):
    img_array = np.array(img)
    img_array = np.max(img_array) - img_array

    rows = np.any(img_array, axis=1)
    cols = np.any(img_array, axis=0)
    
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    padding = 10
    rmin = max(0, rmin - padding)
    rmax = min(img_array.shape[0], rmax + padding)
    cmin = max(0, cmin - padding)
    cmax = min(img_array.shape[1], cmax + padding)
    
    cropped = img_array[rmin:rmax+1, cmin:cmax+1]
    
    cropped_img = Image.fromarray(cropped.astype('uint8'))
    
    h, w = cropped.shape

    if h > w:
        scale = 20 / h
    else:
        scale = 20 / w

    new_h = int(h * scale)
    new_w = int(w * scale)

    resized = cropped_img.resize((new_w, new_h), Resampling.LANCZOS)

    final_img = Image.new('L', (28, 28), 0)
    final_img.paste(resized, ((28 - new_w) // 2, (28 - new_h) // 2))

    final_img = final_img.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    final_array = np.array(final_img).astype('float32') / 255.0

    return final_array.reshape(1, 28, 28, 1)

@app.route("/")

def home():

    return render_template("index.html")

@app.route("/predict", methods=["POST"])

def predict():
    file = request.files["image"]
    img = Image.open(file).convert("L")

    processed = preprocess_for_mnist(img)
    
    pred = model.predict(processed)
    digit = int(np.argmax(pred))

    return jsonify({"prediction": digit})

if __name__ == "__main__":
    app.run(debug=True)
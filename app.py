from flask import Flask, request, jsonify, render_template
import numpy as np
import joblib
from PIL import Image
from PIL.Image import Resampling
import io

app = Flask(__name__)

model = joblib.load("mnist_svm.sav")

@app.route("/")

def home():

    return render_template("index.html")

@app.route("/predict", methods=["POST"])

def predict():

    image_file = request.files["image"].read()
    print(image_file)
    img = Image.open(io.BytesIO(image_file)).convert("L").resize((28,28), Resampling.LANCZOS)
    print(img)
    img = np.array(img).reshape(1, -1)
    img = img / 255.0
    img = 1 - img
    digit = int(model.predict(img))

    return jsonify({"prediction": digit})

if __name__ == "__main__":
    app.run(debug=True)
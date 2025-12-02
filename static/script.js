let predict_btn = document.getElementById("predict");
let clear_btn = document.getElementById("clear");
let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

predict_btn.addEventListener("click", predict)
clear_btn.addEventListener("click", clearCanvas)

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
clearCanvas();

let drawing = false;

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!drawing) return;

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(event.offsetX, event.offsetY, 22, 0, Math.PI * 2);
    ctx.fill();
}

async function predict() {
    let imageBlob = await new Promise((resolve, reject) =>
        canvas.toBlob(resolve, "image/png")
    );

    let formData = new FormData();
    formData.append("image", imageBlob, "digit.png");

    let response = await fetch("https://prabin-handwriting-recognition.onrender.com/predict", {
        method: "POST", body: formData
    });

    let result = await response.json();
    document.getElementById("result").innerText = "Predicted Digit: " + result.prediction;
}


let predict_btn = document.getElementById("predict");
let clear_btn = document.getElementById("clear");
let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function fixCanvasSize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("load", fixCanvasSize);

predict_btn.addEventListener("click", predict)
clear_btn.addEventListener("click", clearCanvas)

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fixCanvasSize();
    document.getElementById("result").innerText = "Predicted Digit: ";
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

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  drawing = true;
  const pos = getTouchPosScaled(e);
  drawPoint(pos.x, pos.y);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!drawing) return;
  const pos = getTouchPosScaled(e);
  drawPoint(pos.x, pos.y);
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
  drawing = false;
});

function getTouchPosScaled(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0]
  const scaleX = 1;
  const scaleY = 1;
//   const scaleX = canvas.width / rect.width;
//   const scaleY = canvas.height / rect.height;
  return {
    x: (touch.clientX - rect.left) * scaleX,
    y: (touch.clientY - rect.top) * scaleY
  };
}

function drawPoint(x, y) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
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


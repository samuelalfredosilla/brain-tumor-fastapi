import os
import shutil
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from tensorflow.keras.models import load_model

# Import fungsi preprocessing yang baru kita perbaiki
from utils.preprocessing import preprocess_image 

app = FastAPI()

# --- SETUP ---
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Load Model
model = load_model("model/best_mobilenetv2.keras")

# --- LABEL MAPPING (PENTING) ---
# ImageDataGenerator mengurutkan folder secara ALPHABETICAL (A-Z).
# Berdasarkan dataset umum Brain Tumor (Testing/Training):
# 0: glioma
# 1: meningioma
# 2: notumor (Huruf 'n' sebelum 'p')
# 3: pituitary

LABELS = {
    0: {"text": "Glioma Tumor",     "css": "glioma"},
    1: {"text": "Meningioma Tumor", "css": "meningioma"},
    2: {"text": "No Tumor",         "css": "notumor"},    # Perbaikan urutan di sini
    3: {"text": "Pituitary Tumor",  "css": "pituitary"}
}

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict", response_class=HTMLResponse)
async def predict(request: Request, file: UploadFile = File(...)):
    # 1. Simpan file sementara
    file_location = f"static/uploads/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Buka gambar
    image = Image.open(file_location)

    # 3. Preprocessing (Resize 200x200 & MobileNetV2 preprocess)
    img_array = preprocess_image(image)

    # 4. Prediksi
    prediction_raw = model.predict(img_array)[0]
    predicted_index = np.argmax(prediction_raw)
    confidence_score = float(prediction_raw[predicted_index])
    
    # 5. Ambil Info Label
    result_info = LABELS.get(predicted_index, {"text": "Unknown", "css": "warning"})

    # 6. Return ke HTML
    return templates.TemplateResponse(
        "result.html",
        {
            "request": request,
            "prediction": result_info["text"],
            "prediction_class": result_info["css"],
            "confidence": round(confidence_score * 100, 2),
            "image_url": f"/{file_location}"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
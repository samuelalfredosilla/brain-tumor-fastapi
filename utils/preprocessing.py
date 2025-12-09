from PIL import Image
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array

def preprocess_image(image: Image.Image):
    # 1. Pastikan format RGB
    if image.mode != "RGB":
        image = image.convert("RGB")

    # 2. Resize ke (200, 200) SESUAI KODE TRAINING ANDA
    # (Sebelumnya mungkin 224x224, tapi di training script tertulis DIMENSIONS = (200, 200))
    image = image.resize((200, 200))

    # 3. Konversi ke Array
    img_array = img_to_array(image)

    # 4. Preprocessing khusus MobileNetV2
    # Fungsi ini akan mengubah range pixel menjadi -1 s.d 1 (bukan 0-1)
    # Ini SANGAT PENTING agar akurasi sesuai training
    img_array = preprocess_input(img_array)

    # 5. Tambah dimensi batch (Model butuh input [1, 200, 200, 3])
    img_array = np.expand_dims(img_array, axis=0)

    return img_array
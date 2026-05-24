import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "True"

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from paddleocr import PaddleOCR
from ollama import Client  # 🌟 Import Client khusus buat custom host
import base64
import cv2
import numpy as np
import json

app = FastAPI()

# 1. Inisialisasi PaddleOCR (Golden Standard)
ocr = PaddleOCR(use_angle_cls=True, lang='en', use_mkldnn=False)

# 2. Inisialisasi Ollama Client (Nembak ke container sebelah)
# Hostname ngikutin nama service di docker-compose.yml
ollama_client = Client(host='http://ollama-engine:11434')

class ScanRequest(BaseModel):
    image: str

@app.post("/extract")
async def extract_receipt(req: ScanRequest):
    try:
        # --- FASE 1: COMPUTER VISION (PADDLEOCR) ---
        img_data = base64.b64decode(req.image.split(",")[1] if "," in req.image else req.image)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Gambarnya rusak cuy")

        result = ocr.ocr(img, cls=True)
        
        raw_text_list = []
        if result is not None:
            for idx in range(len(result)):
                res = result[idx]
                if res is not None:
                    for line in res:
                        text = line[1][0]
                        raw_text_list.append(text)

        full_raw_text = "\n".join(raw_text_list)

        # --- FASE 2: NATURAL LANGUAGE PROCESSING (OLLAMA QWEN2) ---
        prompt = f"""
        Lu adalah asisten kasir otomatis. Ekstrak data struk belanja berikut menjadi JSON.
        Abaikan informasi yang tidak penting seperti alamat, password wifi, atau nomor meja.
        Jika qty tidak tertulis, asumsikan 1.
        
        TUGAS TAMBAHAN:
        Klasifikasikan setiap item ke dalam SALAH SATU dari kategori wajib berikut:
        ["Makan", "Belanja", "Kebersihan", "Tagihan", "Kesehatan", "Hiburan", "Pendidikan", "Transportasi", "Lain-lain"]
        Jika bingung atau tidak yakin, masukkan ke kategori "Lain-lain".
        
        WAJIB kembalikan dengan struktur JSON persis seperti ini:
        {{
            "merchant_name": "Nama Toko",
            "items": [
                {{
                    "item_name": "Nama Makanan", 
                    "qty": 2, 
                    "price": 40000, 
                    "category_name": "Makan"
                }}
            ],
            "tax": 7700,
            "grand_total": 84700
        }}

        Teks Struk Mentah:
        {full_raw_text}
        """

        # Panggil LLM lokal dengan format JSON murni
        response = ollama_client.chat(model='qwen2:1.5b', messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ], format='json')
        
        # Parsing string JSON dari Ollama ke dictionary
        structured_data = json.loads(response['message']['content'])

        return {
            "status": "success",
            "message": "Struk berhasil di-parsing full lokal via Docker!",
            "data": structured_data
        }

    except Exception as e:
        print(f"Error njir: {e}")
        raise HTTPException(status_code=500, detail=str(e))
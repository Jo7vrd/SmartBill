from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import numpy as np
import cv2
from paddleocr import PaddleOCR

app = FastAPI(title="SmartBill AI Worker")

ocr = PaddleOCR(use_angle_cls=True, lang='en')

class ReceiptRequest(BaseModel):
    image_base64: str

@app.get("/health")
def health_check():
    return {"status": "AI Worker is running smoothly, cuy!"}

@app.post("/process-receipt")
def process_receipt(req: ReceiptRequest):
    try:
        img_bytes = base64.b64decode(req.image_base64)

        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise ValueError("Gagal membaca gambar dari Base64")

        result = ocr.ocr(img, cls=True)

        extracted_texts = []
        if result and result[0]:
            for line in result[0]:
                text = line[1][0] 
                extracted_texts.append(text)

        return {
            "status": "success",
            "raw_text": extracted_texts
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
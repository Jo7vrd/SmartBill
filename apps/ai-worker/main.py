import os
import json
import httpx
import cv2
import numpy as np
import base64
import re 
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

GOOGLE_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY belum diset!")

genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel('gemini-3.5-flash')

class ReceiptRequest(BaseModel):
    image: str

def crop_with_padding(img, box, pad_ratio=0.05):
    h, w = img.shape[:2]
    x1, y1, x2, y2 = map(int, box)
    
    pad_x, pad_y = int((x2 - x1) * pad_ratio), int((y2 - y1) * pad_ratio)
    
    x1, y1 = max(0, x1 - pad_x), max(0, y1 - pad_y)
    x2, y2 = min(w, x2 + pad_x), min(h, y2 + pad_y)
    
    return img[y1:y2, x1:x2].copy()

def document_enhance(img):
    original = img.astype(np.float32)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    lo, hi = np.percentile(gray, (5, 95))
    if hi <= lo:
        return img.copy()
    scale = 255.0 / (hi - lo)
    stretched = np.clip((original - lo) * scale, 0, 255)
    return np.clip(0.3 * stretched + 0.7 * original, 0, 255).astype(np.uint8)

def cv2_to_base64(img):
    _, buffer = cv2.imencode('.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 85])
    return base64.b64encode(buffer).decode('utf-8')

HF_API_URL = os.environ.get("HF_API_URL")

@app.post("/extract")
async def extract_receipt(req: ReceiptRequest):
    try:
        base64_str = req.image
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
            
        img_bytes = base64.b64decode(base64_str)

        nparr = np.frombuffer(img_bytes, np.uint8)
        img_cv2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img_h, img_w = img_cv2.shape[:2]

        boxes = []
        async with httpx.AsyncClient() as client:
            files = {"file": ("receipt.jpg", img_bytes, "image/jpeg")}
            
            try:
                yolo_resp = await client.post(HF_API_URL, files=files, timeout=60.0)
                
                if yolo_resp.status_code == 200:
                    predictions = yolo_resp.json()
                    
                    if len(predictions) == 0:
                        return {"status": "error", "message": "Bukan struk cuy! Coba foto ulang.", "data": None}
                    
                    boxes = predictions[0]
                    
                    box_area = (boxes[2] - boxes[0]) * (boxes[3] - boxes[1])
                    total_area = img_w * img_h
                    if (box_area / total_area) < 0.15:
                        return {"status": "error", "message": "Deteksi struk terlalu kecil/tidak valid.", "data": None}
                else:
                    return {"status": "error", "message": "Filter AI lagi sibuk (Status YOLO: " + str(yolo_resp.status_code) + "). Coba lagi nanti.", "data": None}

            except Exception as e:
                return {"status": "error", "message": "Gagal terhubung ke filter YOLO.", "data": None}

        final_base64 = base64_str 
        try:
            cropped_img = crop_with_padding(img_cv2, boxes)
            enhanced_img = document_enhance(cropped_img)
            final_base64 = cv2_to_base64(enhanced_img)
            print("✅ Gambar berhasil di-crop & enhance!")
        except Exception as e:
            print(f"⚠️ Gagal crop/enhance, pake gambar asli: {str(e)}")

        image_part = {"mime_type": "image/jpeg", "data": final_base64}

        prompt = """Analyze this receipt image and return ONLY valid JSON.

        Schema:
        {
        "merchant_name": string,
        "items": [
            {"item_name": string, "qty": number, "price": string, "category_name": string}
        ],
        "tax": string,
        "grand_total": string
        }

        Rules:
        1. merchant_name: use "-" if not found on the receipt.
        2. category_name: pick ONE overall category for the whole receipt (not per item):
        - Makan: bahan makanan, minuman, restoran, warung, kafe
        - Belanja: pakaian, elektronik, aksesori, perabot, hobi
        - Kebersihan: sabun, detergen, produk perawatan tubuh, alat kebersihan rumah
        - Tagihan: listrik, air, internet, telepon, asuransi, cicilan
        - Kesehatan: obat-obatan, suplemen, klinik, apotek, lab
        - Hiburan: bioskop, streaming, game, konser, wisata
        - Pendidikan: buku, kursus, les privat, alat tulis, SPP
        - Transportasi: bensin, parkir, ojek, taksi, tiket, tol
        - Lain-lain: tidak masuk kategori manapun di atas
        3. All money values (productPrice, totalPrice, tax, totalPaid) MUST be strings in Indonesian Rupiah format: dot as thousands separator, no "Rp", no decimals unless cents exist.
        Examples: "18000", "27500", "1250000"
        Normalize messy input: "18k" -> "18000", "Rp27500" -> "27500", "27500" -> "27500"
        4. qty: number, default 1 if missing.
        5. tax: use "0" if no tax on the receipt.
        6. grand_total: if tax > 0, grand_total = grand_total + tax. If tax is "0", grand_total equals grand_total.
        Always compute and format grand_total correctly in Rupiah string format.
        7. Include every purchasable line item you can read."""

        response = gemini_model.generate_content([image_part, prompt])
        raw_text = response.text.strip()

        try:
            if "ERROR_NOT_RECEIPT" in raw_text:
                return {"status": "error", "message": "Gemini bilang ini bukan struk.", "data": None}
            
            json_match = re.search(r"\{[\s\S]*\}", raw_text)
            if json_match:
                parsed_data = json.loads(json_match.group())
            else:
                raise ValueError("Format JSON nggak ditemuin")
        except:
            return {"status": "error", "message": "Gemini gagal baca data struknya.", "data": None}

        return {"status": "success", "message": "Gacor!", "data": parsed_data}

    except Exception as e:
        print(f"Error fatal: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
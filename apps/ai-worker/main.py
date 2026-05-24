import os
import json
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Ambil API Key dari Environment Variable Docker
GOOGLE_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY belum diset!")

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-2.5-flash')

class ReceiptRequest(BaseModel):
    image: str

@app.post("/extract")
async def extract_receipt(req: ReceiptRequest):
    try:
        # 1. Bersihkan base64 string kalau ada prefix 'data:image/jpeg;base64,'
        base64_str = req.image
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]

        # 2. Siapkan payload gambar buat Gemini
        image_part = {
            "mime_type": "image/jpeg",
            "data": base64_str
        }

        # 3. Prompt ketat biar Gemini ga banyak bacot dan cuma ngeluarin JSON
        prompt = """
        Kamu adalah sistem OCR kasir pintar. Ekstrak data dari gambar struk ini. 
        Keluarkan HANYA output berformat JSON murni tanpa awalan/akhiran apapun (jangan gunakan ```json).
        
        Gunakan struktur JSON persis seperti ini:
        {
            "merchant_name": "Nama Toko/Restoran",
            "items": [
                {
                    "item_name": "Nama Menu/Barang", 
                    "qty": 1, 
                    "price": 15000, 
                    "category_name": "Pilih salah satu: Makan, Belanja, Kebersihan, Tagihan, Kesehatan, Hiburan, Pendidikan, Transportasi, Lain-lain"
                }
            ],
            "tax": 0,
            "grand_total": 15000
        }
        Jika tax (pajak/layanan) tidak ditemukan, isi dengan 0. Pastikan price adalah harga satuan dikali qty.
        """

        # 4. Tembak ke Google API
        response = model.generate_content([image_part, prompt])
        
        # 5. Parsing text dari Gemini jadi JSON object python
        raw_text = response.text.strip()
        
        # Jaga-jaga kalau Gemini iseng ngasih backtick markdown
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        parsed_data = json.loads(raw_text)

        # 6. Return persis kayak format AI Worker lu sebelumnya
        return {
            "status": "success",
            "message": "Berhasil ekstrak pakai Gemini cuy!",
            "data": parsed_data
        }

    except Exception as e:
        print(f"Error AI: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
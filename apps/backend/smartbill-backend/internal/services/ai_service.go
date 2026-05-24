package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"time"
)

// Bikin struct buat nge-format JSON yang mau dikirim ke FastAPI
type AIRequestPayload struct {
	Image string `json:"image"`
}

// Bikin struct buat nangkep balasan JSON dari FastAPI
type AIResponsePayload struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"` // Isinya JSON rapi dari Ollama
}

func AnalyzeReceipt(base64Image string) (interface{}, error) {
	// 1. Bungkus Base64-nya ke dalam struct AIRequest
	reqPayload := AIRequestPayload{
		Image: base64Image,
	}

	// 2. Ubah struct jadi JSON bytes
	jsonBytes, err := json.Marshal(reqPayload)
	if err != nil {
		return nil, errors.New("gagal nge-parse JSON buat AI Worker")
	}

	// 3. Tembak ke AI Worker (Pakai nama container 'ai-worker')
	url := "http://ai-worker:8000/extract"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return nil, err
	}

	// 🌟 INI YANG BIKIN FASTAPI NGGAK ERROR 422 LAGI
	req.Header.Set("Content-Type", "application/json")

	// 4. Set Timeout (Ollama CPU butuh waktu agak lama)
	client := &http.Client{
		Timeout: 60 * time.Second, // Kasih waktu 1 menit buat AI mikir
	}

	// 5. Eksekusi request!
	resp, err := client.Do(req)
	if err != nil {
		return nil, errors.New("AI Worker lagi down atau ngambek: " + err.Error())
	}
	defer resp.Body.Close()

	// 6. Cek kalau ada error dari Python (misal 500 Internal Server Error)
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, errors.New("error dari AI Worker: " + string(bodyBytes))
	}

	// 7. Parse balasan dari Python ke struct Go
	var aiResp AIResponsePayload
	if err := json.NewDecoder(resp.Body).Decode(&aiResp); err != nil {
		return nil, errors.New("gagal ngebaca balasan dari AI Worker")
	}

	// Langsung return bagian 'data' yang udah berwujud JSON terstruktur
	return aiResp.Data, nil
}

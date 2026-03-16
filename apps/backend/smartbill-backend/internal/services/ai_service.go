package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"os"
)

func AnalyzeReceipt(base64Image string) (map[string]interface{}, error) {
	payload := map[string]string{
		"image_base64": base64Image,
	}
	payloadBytes, _ := json.Marshal(payload)

	aiWorkerURL := os.Getenv("AI_WORKER_URL")
	if aiWorkerURL == "" {
		aiWorkerURL = "http://ai-worker:8000"
	}
	endpoint := aiWorkerURL + "/process-receipt"

	resp, err := http.Post(endpoint, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, errors.New("gagal menghubungi AI Worker: container mungkin mati")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, errors.New("AI Worker gagal memproses gambar")
	}

	var aiResult map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&aiResult); err != nil {
		return nil, errors.New("gagal membaca balasan dari AI")
	}

	return aiResult, nil
}

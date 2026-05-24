package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"time"
)

type AIRequestPayload struct {
	Image string `json:"image"`
}

type AIResponsePayload struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func AnalyzeReceipt(base64Image string) (interface{}, error) {
	reqPayload := AIRequestPayload{
		Image: base64Image,
	}

	jsonBytes, err := json.Marshal(reqPayload)
	if err != nil {
		return nil, errors.New("gagal nge-parse JSON buat AI Worker")
	}

	url := "http://ai-worker:8000/extract"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{
		Timeout: 180 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, errors.New("AI Worker lagi down atau ngambek: " + err.Error())
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, errors.New("error dari AI Worker: " + string(bodyBytes))
	}

	var aiResp AIResponsePayload
	if err := json.NewDecoder(resp.Body).Decode(&aiResp); err != nil {
		return nil, errors.New("gagal ngebaca balasan dari AI Worker")
	}

	return aiResp.Data, nil
}

package handlers

import (
	"smartbill-backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

func ProcessReceipt(c *fiber.Ctx) error {
	// 1. Bikin struct buat nangkep JSON dari React
	type ReceiptPayload struct {
		Image string `json:"image"`
	}

	var payload ReceiptPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Format request salah. Pastikan mengirim JSON dengan key 'image'",
		})
	}

	if payload.Image == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Gambar struk kosong cuy!",
		})
	}

	// 2. Langsung lempar Base64-nya ke service AI
	aiResult, err := services.AnalyzeReceipt(payload.Image)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	// 3. Return sukses ke Frontend
	return c.JSON(fiber.Map{
		"message": "Berhasil ekstrak struk!",
		"data":    aiResult,
	})
}

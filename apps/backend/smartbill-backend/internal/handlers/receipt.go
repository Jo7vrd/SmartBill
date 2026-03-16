package handlers

import (
	"encoding/base64"
	"io"

	"smartbill-backend/internal/services"

	"github.com/gofiber/fiber/v2"
)

func ProcessReceipt(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Gambar struk tidak ditemukan. Pastikan key form-data adalah 'image'",
		})
	}

	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal membuka file gambar"})
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Gagal membaca isi file"})
	}
	base64Image := base64.StdEncoding.EncodeToString(fileBytes)

	aiResult, err := services.AnalyzeReceipt(base64Image)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Berhasil ekstrak struk!",
		"data":    aiResult,
	})
}

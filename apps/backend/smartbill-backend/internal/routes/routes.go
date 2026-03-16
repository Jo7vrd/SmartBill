package routes

import (
	"smartbill-backend/internal/handlers"
	"smartbill-backend/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	api := app.Group("/api/v1")

	// Public Routes (Gak butuh login)
	api.Post("/register", handlers.Register)
	api.Post("/login", handlers.Login)

	// Endpoint Scan Struk
	api.Post("/scan", middleware.Protected(), handlers.ProcessReceipt)

	// Health Check
	api.Get("/health", middleware.Protected(), func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})
}

package main

import (
	"log"
	"os"

	"smartbill-backend/internal/models"
	"smartbill-backend/internal/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	models.ConnectDatabase()

	app := fiber.New(fiber.Config{
		AppName: "SmartBill API v1",
	})

	// Middleware
	app.Use(cors.New())

	// Setup Routes
	routes.Setup(app)

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(app.Listen(":" + port))
}

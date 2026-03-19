package routes

import (
	"smartbill-backend/internal/handlers"
	"smartbill-backend/internal/middleware"

	fiberws "github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	api := app.Group("/api/v1")

	api.Post("/register", handlers.Register)
	api.Post("/login", handlers.Login)

	api.Post("/scan", middleware.Protected(), handlers.ProcessReceipt)

	api.Get("/health", middleware.Protected(), func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	api.Get("/rooms/:roomCode", handlers.GetRoomByCode)
	api.Post("/rooms/:roomCode/join", handlers.JoinRoom)

	api.Post("/rooms", middleware.Protected(), handlers.CreateRoom)
	api.Post("/rooms/:code/lock", middleware.Protected(), handlers.LockRoom)
	api.Get("/rooms", middleware.Protected(), handlers.GetUserRooms)
	api.Post("/rooms/:code/join-self", middleware.Protected(), handlers.JoinSelf)

	app.Use("/ws", func(c *fiber.Ctx) error {
		if fiberws.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/room/:roomCode", fiberws.New(handlers.LiveSplitHandler))
}

package models

import (
	"fmt"
	"log"
)

func SeedDatabase() {
	categories := []Category{
		{Name: "Makan", Type: "expense"},
		{Name: "Belanja", Type: "expense"},
		{Name: "Kebersihan", Type: "expense"},
		{Name: "Tagihan", Type: "expense"},
		{Name: "Kesehatan", Type: "expense"},
		{Name: "Hiburan", Type: "expense"},
		{Name: "Pendidikan", Type: "expense"},
		{Name: "Transportasi", Type: "expense"},
		{Name: "Lain-lain", Type: "expense"},
	}

	for _, cat := range categories {
		var count int64
		DB.Model(&Category{}).Where("name = ?", cat.Name).Count(&count)

		if count == 0 {
			if err := DB.Create(&cat).Error; err != nil {
				log.Printf("Gagal seed kategori %s: %v", cat.Name, err)
			}
		}
	}

	fmt.Println("🌱 Database Seeding Completed with Custom Categories!")
}

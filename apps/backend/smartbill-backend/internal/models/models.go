package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Base model buat auto-generate UUID
type Base struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

func (base *Base) BeforeCreate(tx *gorm.DB) error {
	base.ID = uuid.New()
	return nil
}

// 1. USERS
type User struct {
	Base
	Name         string        `json:"name"`
	Email        string        `gorm:"uniqueIndex" json:"email"`
	Password     string        `json:"-"`
	Transactions []Transaction `gorm:"foreignKey:PayerID"`
	ItemSplits   []ItemSplit   `gorm:"foreignKey:UserID"`
}

// 2. CATEGORIES
type Category struct {
	Base
	Name             string            `json:"name"`
	Type             string            `json:"type"`
	TransactionItems []TransactionItem `gorm:"foreignKey:CategoryID"`
}

// 3. TRANSACTIONS
type Transaction struct {
	Base
	PayerID       uuid.UUID         `gorm:"type:uuid" json:"payer_id"`
	MerchantName  string            `json:"merchant_name"`
	TaxAndService float64           `gorm:"type:decimal(10,2)" json:"tax_and_service"`
	GrandTotal    float64           `gorm:"type:decimal(10,2)" json:"grand_total"`
	ReceiptURL    string            `json:"receipt_url"`
	Items         []TransactionItem `gorm:"foreignKey:TransactionID" json:"items"`
}

// 4. TRANSACTION_ITEMS
type TransactionItem struct {
	Base
	TransactionID uuid.UUID   `gorm:"type:uuid" json:"transaction_id"`
	CategoryID    uuid.UUID   `gorm:"type:uuid" json:"category_id"`
	ItemName      string      `json:"item_name"`
	Price         float64     `gorm:"type:decimal(10,2)" json:"price"`
	Splits        []ItemSplit `gorm:"foreignKey:ItemID" json:"splits"`
}

// 5. ITEM_SPLITS
type ItemSplit struct {
	Base
	ItemID     uuid.UUID `gorm:"type:uuid" json:"item_id"`
	UserID     uuid.UUID `gorm:"type:uuid" json:"user_id"`
	AmountOwed float64   `gorm:"type:decimal(10,2)" json:"amount_owed"`
	Status     string    `gorm:"default:'pending'" json:"status"`
}

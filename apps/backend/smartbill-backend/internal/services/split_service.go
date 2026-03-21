package services

import (
	"smartbill-backend/internal/models"
	"smartbill-backend/internal/websocket"

	"github.com/google/uuid"
)

func ProcessLiveAction(msg websocket.WSMessage) error {
	if msg.Action == "refresh" {
		return nil
	}

	switch msg.Action {
	case "claim":
		return models.DB.FirstOrCreate(&models.ItemSplit{
			ItemID:   uuid.MustParse(msg.ItemID),
			MemberID: uuid.MustParse(msg.MemberID),
		}, models.ItemSplit{
			ItemID:   uuid.MustParse(msg.ItemID),
			MemberID: uuid.MustParse(msg.MemberID),
		}).Error

	case "unclaim":
		return models.DB.Where("item_id = ? AND member_id = ?", msg.ItemID, msg.MemberID).
			Delete(&models.ItemSplit{}).Error

	case "toggle_paid":
		return models.DB.Exec("UPDATE transaction_members SET has_paid = NOT has_paid WHERE id = ?", msg.MemberID).Error

	case "edit_member":
		return models.DB.Model(&models.TransactionMember{}).Where("id = ?", msg.MemberID).Update("name", msg.Name).Error

	case "delete_member":
		return models.DB.Where("id = ?", msg.MemberID).Delete(&models.TransactionMember{}).Error

	case "update_category":
		var category models.Category
		if err := models.DB.Where("name = ?", msg.Name).First(&category).Error; err != nil {
			return err
		}

		return models.DB.Model(&models.TransactionItem{}).
			Where("id = ?", msg.ItemID).
			Update("category_id", category.ID).Error

	case "edit_item_name":
		return models.DB.Model(&models.TransactionItem{}).
			Where("id = ?", msg.ItemID).
			Update("item_name", msg.Name).Error

	case "edit_item_price":
		return models.DB.Model(&models.TransactionItem{}).
			Where("id = ?", msg.ItemID).
			Update("price", msg.Price).Error

	case "add_item":
		var room models.Transaction
		if err := models.DB.Where("room_code = ?", msg.RoomCode).First(&room).Error; err != nil {
			return err
		}
		newItem := models.TransactionItem{
			Base:          models.Base{ID: uuid.MustParse(msg.ItemID)},
			TransactionID: room.ID,
			ItemName:      msg.Name,
			Price:         msg.Price,
			Qty:           1,
		}
		return models.DB.Create(&newItem).Error

	case "delete_item":
		return models.DB.Where("id = ?", msg.ItemID).Delete(&models.TransactionItem{}).Error
	}

	return nil
}

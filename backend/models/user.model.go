package models

import (
	"time"
)

type User struct {
	ID        string    `gorm:"type:varchar;primary_key;"`
	Name      string    `gorm:"type:varchar(100);not null"`
	Email     string    `gorm:"type:varchar(100);uniqueIndex;not null"`
	Role      string    `gorm:"type:varchar(20);default:'user';"`
	Photo     string    `gorm:"default:'default.png';"`
	Verified  bool      `gorm:"default:false;"`
	Provider  string    `gorm:"default:'local';"`
	Weight    float64   `gorm:"type:numeric(5,2);default:60.00"`  // TODO: add on registeration (also make optional)
	Height    float64   `gorm:"type:numeric(5,2);default:170.00"` // TODO: add on registeration (also make optional)
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`
}

type UserResponse struct {
	ID        string  `json:"id,omitempty"`
	Name      string  `json:"name,omitempty"`
	Email     string  `json:"email,omitempty"`
	Photo     string  `json:"photo,omitempty"`
	Provider  string  `json:"provider,omitempty"`
	Weight    float64 `json:"weight,omitempty"`
	Height    float64 `json:"height,omitempty"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func FilteredResponse(user *User) UserResponse {
	return UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		Photo:     user.Photo,
		Provider:  user.Provider,
		CreatedAt: user.CreatedAt,
		Weight:    user.Weight,
		Height:    user.Height,
		UpdatedAt: user.UpdatedAt,
	}
}

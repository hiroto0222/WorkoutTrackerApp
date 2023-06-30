package models

import (
	"time"
)

type User struct {
	ID    string `gorm:"type:varchar;primary_key;"`
	Name  string `gorm:"type:varchar(100);not null"`
	Email string `gorm:"type:varchar(100);uniqueIndex;not null"`

	Role  string `gorm:"type:varchar(20);default:'user';"`
	Photo string `gorm:"default:'default.png';"`

	Verified  bool      `gorm:"default:false;"`
	Provider  string    `gorm:"default:'local';"`
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`
}

type UserResponse struct {
	ID        string `json:"id,omitempty"`
	Name      string `json:"name,omitempty"`
	Email     string `json:"email,omitempty"`
	Role      string `json:"role,omitempty"`
	Provider  string `json:"provider,omitempty"`
	Photo     string `json:"photo,omitempty"`
	Verified  bool   `json:"verified,omitempty"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func FilteredResponse(user *User) UserResponse {
	return UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		Role:      user.Role,
		Verified:  user.Verified,
		Photo:     user.Photo,
		Provider:  user.Provider,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}

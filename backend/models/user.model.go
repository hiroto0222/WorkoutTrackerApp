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

package models

import (
	"time"
)

type User struct {
	ID        string    `json:"id" gorm:"type:varchar;primary_key;"`
	Name      string    `json:"name" gorm:"type:varchar(100);not null"`
	Email     string    `json:"email" gorm:"type:varchar(100);uniqueIndex;not null"`
	Role      string    `json:"role" gorm:"type:varchar(20);default:'user';"`
	Photo     string    `json:"photo" gorm:"default:'default.png';"`
	Verified  bool      `json:"verified" gorm:"default:false;"`
	Provider  string    `json:"provider" gorm:"default:'local';"`
	Weight    float64   `json:"weight" gorm:"type:numeric(5,2);default:60.00"`  // TODO: add on registeration (also make optional)
	Height    float64   `json:"height" gorm:"type:numeric(5,2);default:170.00"` // TODO: add on registeration (also make optional)
	CreatedAt time.Time `json:"created_at" gorm:"not null"`
	UpdatedAt time.Time `json:"updated_at" gorm:"not null"`

	Workouts []Workout `json:"-" gorm:"constraint:OnDelete:CASCADE;"`
}

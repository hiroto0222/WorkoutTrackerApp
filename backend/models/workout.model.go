package models

import "time"

type Workout struct {
	ID        int       `gorm:"type:int AUTO_INCREMENT;primary_key;"`
	UserID    string    `gorm:"type:varchar;not null"`
	StartedAt time.Time `gorm:"not null"`
	EndedAt   time.Time `gorm:"null"`
	UpdatedAt time.Time `gorm:"not null"`

	User User `gorm:"foreignKey:UserID"`
}

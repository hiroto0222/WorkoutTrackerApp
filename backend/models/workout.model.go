package models

import "time"

type Workout struct {
	ID        uint      `gorm:"type:serial;primary_key;auto_increment"`
	UserID    string    `gorm:"type:varchar;not null"`
	StartedAt time.Time `gorm:"not null"`
	EndedAt   time.Time `gorm:"not null"`
	UpdatedAt time.Time `gorm:"not null"`

	User User `gorm:"foreignKey:UserID"`
}

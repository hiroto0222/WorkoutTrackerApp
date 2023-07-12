package models

import "time"

type Workout struct {
	ID        int       `json:"id" gorm:"type:int AUTO_INCREMENT;primary_key;"`
	UserID    string    `json:"user_id" gorm:"type:varchar;not null"`
	StartedAt time.Time `json:"started_at" gorm:"not null"`
	EndedAt   time.Time `json:"ended_at" gorm:"null"`
	UpdatedAt time.Time `json:"updated_at" gorm:"not null"`

	User User `json:"-" gorm:"foreignKey:UserID"`
}

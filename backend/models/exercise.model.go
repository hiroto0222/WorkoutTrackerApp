package models

import "time"

type Exercise struct {
	ID          uint      `gorm:"type:serial;primary_key;auto_increment"`
	Name        string    `gorm:"type:varchar(255);uniqueIndex;not null"`
	Description string    `gorm:"type:text"`
	CreatedAt   time.Time `gorm:"not null"`
	UpdatedAt   time.Time `gorm:"not null"`
}

type ExerciseResponse struct {
	ID          uint   `json:"id,omitempty"`
	Name        string `json:"name,omitempty"`
	Description string `json:"description,omitempty"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

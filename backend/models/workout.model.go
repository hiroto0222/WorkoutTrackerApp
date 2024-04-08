package models

import (
	"time"

	"github.com/google/uuid"
)

type Workout struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primary_key;"`
	UserID    string    `json:"user_id" gorm:"type:varchar;not null"`
	StartedAt time.Time `json:"started_at" gorm:"not null"`
	EndedAt   time.Time `json:"ended_at" gorm:"null"`
	UpdatedAt time.Time `json:"updated_at" gorm:"not null"`

	User             User              `json:"-" gorm:"foreignKey:UserID"`
	WorkoutExercises []WorkoutExercise `json:"-" gorm:"constraint:OnDelete:CASCADE;"`
}

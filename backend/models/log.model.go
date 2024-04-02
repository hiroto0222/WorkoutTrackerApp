package models

import (
	"github.com/google/uuid"
)

type Log struct {
	ID                int       `gorm:"type:int AUTO_INCREMENT;primary_key;"`
	WorkoutID         uuid.UUID `gorm:"type:uuid;not null"`
	WorkoutExerciseID int       `gorm:"type:int;not null"`
	SetNumber         int       `gorm:"not null"`
	Weight            int       `gorm:"type:int"`
	Reps              int       `gorm:"type:int"`
	Time              int       `gorm:"type:int"`

	Workout         Workout         `gorm:"foreignKey:WorkoutID"`
	WorkoutExercise WorkoutExercise `gorm:"foreignKey:WorkoutExerciseID"`
}

package models

import "github.com/google/uuid"

type WorkoutExercise struct {
	ID         int       `gorm:"type:int AUTO_INCREMENT;primary_key"`
	WorkoutID  uuid.UUID `gorm:"type:uuid;not null"`
	ExerciseID int       `gorm:"type:int;not null"`

	Workout  Workout  `gorm:"foreignKey:WorkoutID"`
	Exercise Exercise `gorm:"foreignKey:ExerciseID"`
}

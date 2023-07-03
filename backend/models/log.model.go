package models

import "time"

type Log struct {
	ID                int       `gorm:"type:int AUTO_INCREMENT;primary_key;"`
	WorkoutID         int       `gorm:"type:int;not null"`
	WorkoutExerciseID int       `gorm:"type:int;not null"`
	SetNumber         int       `gorm:"not null"`
	Weight            int       `gorm:"not null"`
	Reps              int       `gorm:"not null"`
	CreatedAt         time.Time `gorm:"not null"`
	UpdatedAt         time.Time `gorm:"not null"`

	Workout         Workout         `gorm:"foreignKey:WorkoutID"`
	WorkoutExercise WorkoutExercise `gorm:"foreignKey:WorkoutExerciseID"`
}

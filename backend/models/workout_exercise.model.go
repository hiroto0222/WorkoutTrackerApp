package models

type WorkoutExercise struct {
	ID         uint `gorm:"type:serial;primary_key;auto_increment"`
	WorkoutID  uint `gorm:"type:serial;not null"`
	ExerciseID uint `gorm:"type:serial;not null"`

	Workout  Workout  `gorm:"foreignKey:WorkoutID"`
	Exercise Exercise `gorm:"foreignKey:ExerciseID"`
}

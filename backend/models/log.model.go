package models

type Log struct {
	ID                int `gorm:"type:int AUTO_INCREMENT;primary_key;"`
	WorkoutExerciseID int `gorm:"type:int;not null"`
	SetNumber         int `gorm:"not null"`
	Weight            int `gorm:"type:int"`
	Reps              int `gorm:"type:int"`
	Time              int `gorm:"type:int"`

	WorkoutExercise WorkoutExercise `gorm:"foreignKey:WorkoutExerciseID"`
}

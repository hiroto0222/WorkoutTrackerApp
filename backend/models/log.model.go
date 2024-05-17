package models

type Log struct {
	ID                int     `gorm:"type:int AUTO_INCREMENT;primary_key;"`
	WorkoutExerciseID int     `gorm:"type:int;not null"`
	SetNumber         int     `gorm:"type:int;not null"`
	Weight            float64 `gorm:"type:numeric(5,2)"`
	Reps              int     `gorm:"type:int"`
	Time              float64 `gorm:"type:numeric(5,2)"`

	WorkoutExercise WorkoutExercise `gorm:"foreignKey:WorkoutExerciseID"`
}

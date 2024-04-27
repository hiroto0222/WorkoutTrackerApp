package services

import (
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type ExerciseService interface {
	GetExercises() ([]models.Exercise, error)
}

type ExerciseServiceImpl struct {
	db *gorm.DB
}

func NewExerciseService(db *gorm.DB) *ExerciseServiceImpl {
	return &ExerciseServiceImpl{
		db: db,
	}
}

// GetExercises retrieves all exercises from DB
func (s *ExerciseServiceImpl) GetExercises() ([]models.Exercise, error) {
	var exercises []models.Exercise
	res := s.db.Find(&exercises)
	if res.Error != nil {
		return nil, res.Error
	}

	return exercises, nil
}

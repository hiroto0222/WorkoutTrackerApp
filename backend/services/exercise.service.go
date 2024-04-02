package services

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type ExerciseService interface {
	GetExercises(ctx *gin.Context)
}

type ExerciseServiceImpl struct {
	db *gorm.DB
}

// GetExercises retrieves all exercises
func (s *ExerciseServiceImpl) GetExercises(ctx *gin.Context) {
	var exercises []models.Exercise
	res := s.db.Find(&exercises)
	if res.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve exercises"})
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success", "data": exercises})
}

func NewExerciseService(db *gorm.DB) *ExerciseServiceImpl {
	return &ExerciseServiceImpl{
		db: db,
	}
}

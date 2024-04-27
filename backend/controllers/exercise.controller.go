package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/services"
)

type ExerciseController interface {
	GetExercises(ctx *gin.Context)
}

type ExerciseControllerImpl struct {
	svc services.ExerciseService
}

func NewExerciseController(exerciseService *services.ExerciseServiceImpl) *ExerciseControllerImpl {
	return &ExerciseControllerImpl{
		svc: exerciseService,
	}
}

// GetExercises retrieves all exercises
func (e *ExerciseControllerImpl) GetExercises(ctx *gin.Context) {
	exercises, err := e.svc.GetExercises()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve exercises"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success", "data": exercises})
}

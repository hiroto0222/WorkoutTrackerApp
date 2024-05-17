package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/models"
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

type GetExercisesResponse struct {
	Message string            `json:"message"`
	Data    []models.Exercise `json:"data"`
}

// GetExercises retrieves all exercises
func (e *ExerciseControllerImpl) GetExercises(ctx *gin.Context) {
	exercises, err := e.svc.GetExercises()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve exercises"})
		return
	}

	ctx.JSON(http.StatusOK, GetExercisesResponse{Message: "success", Data: exercises})
}

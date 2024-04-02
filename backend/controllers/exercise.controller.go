package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/services"
)

type ExerciseController interface {
	GetExercises(ctx *gin.Context)
}

type ExerciseControllerImpl struct {
	svc services.ExerciseService
}

func (e *ExerciseControllerImpl) GetExercises(ctx *gin.Context) {
	e.svc.GetExercises(ctx)
}

func NewExerciseController(exerciseService *services.ExerciseServiceImpl) *ExerciseControllerImpl {
	return &ExerciseControllerImpl{
		svc: exerciseService,
	}
}

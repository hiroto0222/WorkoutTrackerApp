package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/services"
)

type WorkoutController interface {
	CreateWorkout(ctx *gin.Context)
	DeleteWorkout(ctx *gin.Context)
}

type WorkoutControllerImpl struct {
	svc services.WorkoutService
}

func (w *WorkoutControllerImpl) CreateWorkout(ctx *gin.Context) {
	w.svc.CreateWorkout(ctx)
}

func (w *WorkoutControllerImpl) DeleteWorkout(ctx *gin.Context) {
	w.svc.DeleteWorkout(ctx)
}

func NewWorkoutController(workoutService *services.WorkoutServiceImpl) *WorkoutControllerImpl {
	return &WorkoutControllerImpl{
		svc: workoutService,
	}
}

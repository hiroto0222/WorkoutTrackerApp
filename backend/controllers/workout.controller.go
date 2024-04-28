package controllers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/middlewares"
	"github.com/hiroto0222/workout-tracker-app/services"
)

type WorkoutController interface {
	CreateWorkout(ctx *gin.Context)
	GetWorkouts(ctx *gin.Context)
	DeleteWorkout(ctx *gin.Context)
}

type WorkoutControllerImpl struct {
	svc services.WorkoutService
}

func NewWorkoutController(workoutService *services.WorkoutServiceImpl) *WorkoutControllerImpl {
	return &WorkoutControllerImpl{
		svc: workoutService,
	}
}

type CreateWorkoutRequest struct {
	UserId      string                 `json:"user_id" binding:"required"`
	StartedAt   time.Time              `json:"started_at" binding:"required"`
	EndedAt     time.Time              `json:"ended_at" binding:"required"`
	ExerciseIds []int                  `json:"exercise_ids" binding:"required"`
	Logs        map[int][]services.Log `json:"logs" binding:"required"`
}

// CreateWorkout adds a new workout record for the user
func (w *WorkoutControllerImpl) CreateWorkout(ctx *gin.Context) {
	// retrieve create workout request
	rawJSON, _ := io.ReadAll(ctx.Request.Body)
	var req CreateWorkoutRequest
	if err := json.Unmarshal(rawJSON, &req); err != nil {
		log.Println("CreateWorkout JSON unmarshalling failed:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid workout data recieved"})
		return
	}

	// check if authenticated user is the owner of the request
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id for request"})
		return
	}
	if userID != req.UserId {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission"})
		return
	}

	// create workout params
	params := &services.CreateWorkoutParams{
		UserID:      userID,
		StartedAt:   req.StartedAt,
		EndedAt:     req.EndedAt,
		ExerciseIds: req.ExerciseIds,
		Logs:        req.Logs,
	}

	workoutData, err := w.svc.CreateWorkout(params)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Successfully added workout entry", "data": workoutData})
}

// GetWorkouts gets all workout records for the user
func (w *WorkoutControllerImpl) GetWorkouts(ctx *gin.Context) {
	// get req parameters
	reqUserId, ok := ctx.Params.Get("user_id")
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Parameters not provided"})
		return
	}

	// TODO: get req queries
	// limit := 1000
	// offset, err := strconv.Atoi(ctx.Query("offset"))
	// if err != nil {
	// 	ctx.JSON(http.StatusBadRequest, gin.H{"message": "Query not provided"})
	// 	return
	// }

	// get id of user from middlewares and check if owner of request
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id from request"})
		return
	}
	if userID != reqUserId {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission"})
		return
	}

	workoutsData, err := w.svc.GetWorkouts(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Successfully retrieved workout data", "data": workoutsData})
}

// DeleteWorkout deletes a workout record
func (w *WorkoutControllerImpl) DeleteWorkout(ctx *gin.Context) {
	// get req parameters
	reqWorkoutId, ok := ctx.Params.Get("workout_id")
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Parameters not provided"})
		return
	}

	// get id of user from middleware
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id from request"})
		return
	}

	// delete workout
	err := w.svc.DeleteWorkout(reqWorkoutId, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "delete success"})
}

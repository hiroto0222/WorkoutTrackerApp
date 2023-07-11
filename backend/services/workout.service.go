package services

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/middlewares"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type WorkoutService interface {
	CreateWorkout(ctx *gin.Context)
	DeleteWorkout(ctx *gin.Context)
}

type WorkoutServiceImpl struct {
	db *gorm.DB
}

// CreateWorkout adds a new Workout record
func (s *WorkoutServiceImpl) CreateWorkout(ctx *gin.Context) {
	// get authenticated user's ID
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id for request"})
		return
	}

	// create workout
	now := time.Now()
	workout := models.Workout{
		UserID:    userID,
		StartedAt: now,
		UpdatedAt: now,
	}
	res := s.db.Create(&workout)

	if res.Error != nil {
		log.Printf("failed to create workout: %v", res.Error)
		ctx.JSON(http.StatusBadRequest, gin.H{"message": res.Error.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, workout)
}

type deleteWorkoutRequest struct {
	ID string `json:"id" binding:"required"`
}

// DeleteWorkout deletes a Workout record
func (s *WorkoutServiceImpl) DeleteWorkout(ctx *gin.Context) {
	var req deleteWorkoutRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Println("binding json req failed")
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// get authenticated user's ID
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id for request"})
		return
	}

	// check if workout exists and is of authenticated user
	var workout models.Workout
	res := s.db.First(&workout, "id = ?", req.ID)
	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Workout does not exist"})
		return
	}
	if workout.UserID != userID {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission"})
		return
	}

	s.db.Delete(&workout)
	ctx.JSON(http.StatusOK, gin.H{"message": "Successfully deleted workout"})
}

func NewWorkoutService(db *gorm.DB) *WorkoutServiceImpl {
	return &WorkoutServiceImpl{
		db: db,
	}
}

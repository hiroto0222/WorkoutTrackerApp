package services

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/hiroto0222/workout-tracker-app/middlewares"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type WorkoutService interface {
	CreateWorkout(ctx *gin.Context)
	GetWorkouts(ctx *gin.Context)
}

type WorkoutServiceImpl struct {
	db *gorm.DB
}

type LogRequest struct {
	Weight int `json:"weight"`
	Reps   int `json:"reps"`
	Time   int `json:"time"`
}

type CreateWorkoutRequest struct {
	UserId      string               `json:"user_id" binding:"required"`
	StartedAt   time.Time            `json:"started_at" binding:"required"`
	EndedAt     time.Time            `json:"ended_at" binding:"required"`
	ExerciseIds []int                `json:"exercise_ids" binding:"required"`
	Logs        map[int][]LogRequest `json:"logs" binding:"required"`
}

// CreateWorkout adds a new workout record for the user
func (s *WorkoutServiceImpl) CreateWorkout(ctx *gin.Context) {
	rawJSON, _ := io.ReadAll(ctx.Request.Body)
	var req CreateWorkoutRequest
	if err := json.Unmarshal(rawJSON, &req); err != nil {
		log.Println("JSON unmarshalling failed:", err)
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

	// start database transaction
	tx := s.db.Begin()

	// create workout
	workout := models.Workout{
		UserID:    userID,
		StartedAt: req.StartedAt,
		EndedAt:   req.EndedAt,
		UpdatedAt: req.StartedAt,
	}
	res := s.db.Create(&workout)
	if res.Error != nil {
		log.Printf("failed to create workout: %v", res.Error)
		ctx.JSON(http.StatusBadRequest, gin.H{"message": res.Error.Error()})
		return
	}

	// create workout_exercise for each exercise
	for _, exerciseId := range req.ExerciseIds {
		workoutExercise := models.WorkoutExercise{
			WorkoutID:  workout.ID,
			ExerciseID: exerciseId,
		}
		res := s.db.Create(&workoutExercise)
		if res.Error != nil {
			log.Printf("failed to create workout_exercise: %v", res.Error)
			ctx.JSON(http.StatusBadRequest, gin.H{"message": res.Error.Error()})
			return
		}

		// create exercise logs for each exercise
		if logSlice, ok := req.Logs[exerciseId]; ok {
			for setNumber, logReq := range logSlice {
				newLog := models.Log{
					WorkoutID:         workout.ID,
					WorkoutExerciseID: workoutExercise.ID,
					SetNumber:         setNumber + 1,
					Weight:            logReq.Weight,
					Reps:              logReq.Reps,
					Time:              logReq.Time,
				}
				res := s.db.Create(&newLog)
				if res.Error != nil {
					log.Printf("failed to create exercise log: %v", res.Error)
					ctx.JSON(http.StatusBadRequest, gin.H{"message": res.Error.Error()})
					return
				}
			}
		}
	}

	// Commit the transaction if all operations succeed
	if err := tx.Commit().Error; err != nil {
		// Handle transaction commit error
		tx.Rollback() // Rollback changes to ensure data integrity
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to commit transaction"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Successfully added workout entry"})
}

type GetWorkoutsRequestParams struct {
	userID string `uri:"user_id" binding:"required,min=1"`
}

type GetWorkoutsResponse struct {
	ID        uuid.UUID `json:"id" binding:"required"`
	StartedAt time.Time `json:"started_at" binding:"required"`
	EndedAt   time.Time `json:"ended_at" binding:"required"`
}

// GetWorkouts gets workout records for the user
func (s *WorkoutServiceImpl) GetWorkouts(ctx *gin.Context) {
	// get req parameters
	var reqParams GetWorkoutsRequestParams
	if err := ctx.ShouldBindUri(&reqParams); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Parameters not provided"})
		return
	}

	// get req queries
	limit := 1000
	offset, err := strconv.Atoi(ctx.Query("offset"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Query not provided"})
		return
	}

	// get id of user from middlewares and check if owner of request
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id from request"})
		return
	}
	if userID != reqParams.userID {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission"})
		return
	}

	// retrieve workouts for user
	var workouts []models.Workout
	res := s.db.Where("user_id = ?", userID).Limit(limit).Offset(offset).Find(&workouts)
	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve workouts from database"})
		return
	}

	var data []GetWorkoutsResponse
	for _, workout := range workouts {
		data = append(data, GetWorkoutsResponse{
			ID:        workout.ID,
			StartedAt: workout.StartedAt,
			EndedAt:   workout.EndedAt,
		})
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success", "data": data})
}

func NewWorkoutService(db *gorm.DB) *WorkoutServiceImpl {
	return &WorkoutServiceImpl{
		db: db,
	}
}

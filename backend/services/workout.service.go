package services

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
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
	DeleteWorkout(ctx *gin.Context)
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

type CreateWorkoutResponse struct {
	Workout models.Workout `json:"workout" binding:"required"`
	Logs    []logResponse  `json:"logs" binding:"required"`
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
	logsRes := []logResponse{}

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
					WorkoutExerciseID: workoutExercise.ID,
					SetNumber:         setNumber + 1,
					Weight:            logReq.Weight,
					Reps:              logReq.Reps,
					Time:              logReq.Time,
				}
				res := s.db.Create(&newLog)
				logsRes = append(logsRes, logResponse{
					ExerciseId: exerciseId,
					Weight:     logReq.Weight,
					Reps:       logReq.Reps,
					Time:       logReq.Time,
				})
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

	data := CreateWorkoutResponse{
		Workout: workout,
		Logs:    logsRes,
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "Successfully added workout entry", "data": data})
}

type workoutResponse struct {
	ID        uuid.UUID `json:"id" binding:"required"`
	StartedAt time.Time `json:"started_at" binding:"required"`
	EndedAt   time.Time `json:"ended_at" binding:"required"`
}

type logResponse struct {
	ExerciseId int `json:"exercise_id"`
	Weight     int `json:"weight"`
	Reps       int `json:"reps"`
	Time       int `json:"time"`
}

// WorkoutLogsResponse is a map of workout_id -> []LogResponse
type workoutLogsResponse map[uuid.UUID][]logResponse

type GetWorkoutsResponse struct {
	Workouts    []workoutResponse   `json:"workouts" binding:"required"`
	WorkoutLogs workoutLogsResponse `json:"workout_logs" binding:"required"`
}

// GetWorkouts gets workout records for the user
func (s *WorkoutServiceImpl) GetWorkouts(ctx *gin.Context) {
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

	// retrieve workouts data for user
	rows, err := s.db.Raw(`
		SELECT w.id, w.started_at, w.ended_at, we.exercise_id AS "exercise_id", l.weight, l.reps, l.time
		FROM workouts w
			INNER JOIN workout_exercises we
				ON we.workout_id = w.id AND w.user_id = ?
			INNER JOIN logs l
				ON we.id = l.workout_exercise_id
		ORDER BY w.started_at DESC, we.id, l.set_number;
	`, userID).Rows()

	if err != nil {
		log.Panic("Failed to run sql query")
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve data"})
		return
	}

	workoutLogs := workoutLogsResponse{}
	workouts := []workoutResponse{}
	var (
		workoutId  uuid.UUID
		startedAt  time.Time
		EndedAt    time.Time
		exerciseId int
		logWeight  int
		logReps    int
		logTime    int
	)

	defer rows.Close()
	for rows.Next() {
		// scan sql row
		err := rows.Scan(&workoutId, &startedAt, &EndedAt, &exerciseId, &logWeight, &logReps, &logTime)
		if err != nil {
			log.Panic("Failed to scan sql row")
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve data"})
			return
		}

		// create new log
		newLogResponse := logResponse{
			ExerciseId: exerciseId,
			Weight:     logWeight,
			Reps:       logReps,
			Time:       logTime,
		}

		_, ok := workoutLogs[workoutId]
		if !ok {
			// add workout to workouts if not already added
			workouts = append(workouts, workoutResponse{
				ID:        workoutId,
				StartedAt: startedAt,
				EndedAt:   EndedAt,
			})
			// create log slice
			workoutLogs[workoutId] = []logResponse{newLogResponse}
		} else {
			// append to log slice
			workoutLogs[workoutId] = append(workoutLogs[workoutId], newLogResponse)
		}
	}

	data := GetWorkoutsResponse{
		Workouts:    workouts,
		WorkoutLogs: workoutLogs,
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success", "data": data})
}

// DeleteWorkout deletes a workout records specified by the user
func (s *WorkoutServiceImpl) DeleteWorkout(ctx *gin.Context) {
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

	var workout models.Workout
	res := s.db.First(&workout, "id = ?", reqWorkoutId)
	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user from database"})
		return
	}

	// check if requested user is the owner of the workout
	if userID != workout.UserID {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission"})
		return
	}

	// delete workout
	res = s.db.Delete(&models.Workout{}, workout.ID)
	if res.Error != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete workout from database"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "delete success"})
}

func NewWorkoutService(db *gorm.DB) *WorkoutServiceImpl {
	return &WorkoutServiceImpl{
		db: db,
	}
}

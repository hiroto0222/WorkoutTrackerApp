package services

import (
	"errors"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type WorkoutService interface {
	CreateWorkout(createWorkoutParams *CreateWorkoutParams) (*CreateWorkoutResponse, error)
	GetWorkouts(userID string) (*GetWorkoutsResponse, error)
	DeleteWorkout(workoutID, userID string) error
}

type WorkoutServiceImpl struct {
	db *gorm.DB
}

func NewWorkoutService(db *gorm.DB) *WorkoutServiceImpl {
	return &WorkoutServiceImpl{
		db: db,
	}
}

type CreateWorkoutParams struct {
	UserID      string
	StartedAt   time.Time
	EndedAt     time.Time
	ExerciseIds []int
	Logs        map[int][]Log
}

type Log struct {
	Weight int
	Reps   int
	Time   int
}

type CreateWorkoutResponse struct {
	Workout models.Workout `json:"workout" binding:"required"`
	Logs    []logResponse  `json:"logs" binding:"required"`
}

// CreateWorkout adds a new workout, workout_exercise, and logs in DB
func (s *WorkoutServiceImpl) CreateWorkout(createWorkoutParams *CreateWorkoutParams) (*CreateWorkoutResponse, error) {
	// start database transaction
	tx := s.db.Begin()

	// workout log data
	logsRes := []logResponse{}

	// create workout
	workout := models.Workout{
		UserID:    createWorkoutParams.UserID,
		StartedAt: createWorkoutParams.StartedAt,
		EndedAt:   createWorkoutParams.EndedAt,
		UpdatedAt: createWorkoutParams.StartedAt,
	}
	res := s.db.Create(&workout)
	if res.Error != nil {
		log.Printf("failed to create workout: %v", res.Error)
		return nil, res.Error
	}

	// create workout_exercise for each exercise
	for _, exerciseId := range createWorkoutParams.ExerciseIds {
		workoutExercise := models.WorkoutExercise{
			WorkoutID:  workout.ID,
			ExerciseID: exerciseId,
		}
		res := s.db.Create(&workoutExercise)
		if res.Error != nil {
			log.Printf("failed to create workout_exercise: %v", res.Error)
			return nil, res.Error
		}

		// create exercise logs for each exercise
		if logSlice, ok := createWorkoutParams.Logs[exerciseId]; ok {
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
					return nil, res.Error
				}
			}
		}
	}

	// Commit the transaction if all operations succeed
	if err := tx.Commit().Error; err != nil {
		// Handle transaction commit error
		tx.Rollback() // Rollback changes to ensure data integrity
		log.Println("failed to commit transaction")
		return nil, res.Error
	}

	data := CreateWorkoutResponse{
		Workout: workout,
		Logs:    logsRes,
	}

	return &data, nil
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

// GetWorkouts retrieves all the workouts and associated logs using inner joins
func (s *WorkoutServiceImpl) GetWorkouts(userID string) (*GetWorkoutsResponse, error) {
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
		return nil, err
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
			return nil, err
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

	return &data, nil
}

// DeleteWorkout deletes a workout records specified by the user
func (s *WorkoutServiceImpl) DeleteWorkout(workoutID, userID string) error {
	var workout models.Workout
	res := s.db.First(&workout, "id = ?", workoutID)
	if res.Error != nil {
		return res.Error
	}

	// check if requested user is the owner of the workout
	if userID != workout.UserID {
		return errors.New("you do not have permission")
	}

	// delete workout
	res = s.db.Delete(&models.Workout{}, workout.ID)
	if res.Error != nil {
		return res.Error
	}

	return nil
}

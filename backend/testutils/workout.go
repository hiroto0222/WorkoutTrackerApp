package testutils

import (
	"time"

	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/services"
)

func CreateTestWorkout(userID string) (models.Workout, []models.WorkoutExercise, []models.Log, *services.CreateWorkoutParams) {
	// init CreateWorkoutParams
	now := time.Now()
	createWorkoutParams := &services.CreateWorkoutParams{
		UserID:      userID,
		StartedAt:   now,
		EndedAt:     now.Add(time.Hour), // Assuming workout duration is one hour
		ExerciseIds: []int{1, 2},        // Assuming two exercises
		Logs: map[int][]services.Log{
			1: {
				{Weight: 50.5, Reps: 10, Time: 30}, // Sample log for exercise ID 1
				{Weight: 60, Reps: 12, Time: 35},   // Another sample log for exercise ID 1
			},
			2: {
				{Weight: 40.5, Reps: 8, Time: 25}, // Sample log for exercise ID 2
				{Weight: 45, Reps: 10, Time: 30},  // Another sample log for exercise ID 2
			},
		},
	}

	workout := models.Workout{
		UserID:    createWorkoutParams.UserID,
		StartedAt: createWorkoutParams.StartedAt,
		EndedAt:   createWorkoutParams.EndedAt,
		UpdatedAt: createWorkoutParams.StartedAt,
	}

	var workoutExercises []models.WorkoutExercise
	var logs []models.Log

	for _, exerciseID := range createWorkoutParams.ExerciseIds {
		// create test workout_exercise
		workoutExercise := models.WorkoutExercise{
			WorkoutID:  workout.ID,
			ExerciseID: exerciseID,
		}
		workoutExercises = append(workoutExercises, workoutExercise)

		// create test logs
		if logSlice, ok := createWorkoutParams.Logs[exerciseID]; ok {
			for setNumber, logReq := range logSlice {
				log := models.Log{
					WorkoutExerciseID: workoutExercise.ID,
					SetNumber:         setNumber + 1,
					Weight:            logReq.Weight,
					Reps:              logReq.Reps,
					Time:              logReq.Time,
				}
				logs = append(logs, log)
			}
		}
	}

	return workout, workoutExercises, logs, createWorkoutParams
}

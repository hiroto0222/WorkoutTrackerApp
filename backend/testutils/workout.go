package testutils

import (
	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/services"
)

func CreateTestWorkout(createWorkoutParams *services.CreateWorkoutParams) (models.Workout, []models.WorkoutExercise, []models.Log) {
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

	return workout, workoutExercises, logs
}

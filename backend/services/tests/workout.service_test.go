package service_tests

import (
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/services"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/assert"
)

func TestCreateWorkout(t *testing.T) {
	// Initialize mock db
	sqlDB, db, mock := mock.NewMockDB(t)
	svc := services.NewWorkoutService(db)

	defer sqlDB.Close()

	// Define test data
	now := time.Now()
	createWorkoutParams := &services.CreateWorkoutParams{
		UserID:      "123",
		StartedAt:   now,
		EndedAt:     now.Add(time.Hour), // Assuming workout duration is one hour
		ExerciseIds: []int{1, 2},        // Assuming two exercises
		Logs: map[int][]services.Log{
			1: {
				{Weight: 50, Reps: 10, Time: 30}, // Sample log for exercise ID 1
				{Weight: 60, Reps: 12, Time: 35}, // Another sample log for exercise ID 1
			},
			2: {
				{Weight: 40, Reps: 8, Time: 25},  // Sample log for exercise ID 2
				{Weight: 45, Reps: 10, Time: 30}, // Another sample log for exercise ID 2
			},
		},
	}

	// create test workout
	workout, workoutExercises, logs := testutils.CreateTestWorkout(createWorkoutParams)

	// define rows
	workoutRows := mock.NewRows([]string{"id", "user_id", "started_at", "ended_at", "updated_at"})
	workoutExerciseRows := mock.NewRows([]string{"id", "workout_id", "exercise_id"})
	logRows := mock.NewRows([]string{"id", "workout_exercise_id", "set_number", "weight", "reps", "time"})

	// add rows
	workoutRows.AddRow(workout.ID, workout.UserID, workout.StartedAt, workout.EndedAt, workout.StartedAt)
	for _, workoutExercise := range workoutExercises {
		workoutExerciseRows.AddRow(workoutExercise.ID, workoutExercise.WorkoutID, workoutExercise.ExerciseID)
	}
	for _, log := range logs {
		logRows.AddRow(log.ID, log.WorkoutExerciseID, log.SetNumber, log.Weight, log.Reps, log.Time)
	}

	// start expectations
	mock.ExpectBegin()

	// expect insert into workouts
	mock.ExpectBegin()
	mock.ExpectQuery("INSERT INTO \"workouts\" (.+) VALUES (.+)").WillReturnRows(workoutRows)
	mock.ExpectCommit()

	// expect insert into workout_exercises
	for i := 1; i <= 2; i++ {
		mock.ExpectBegin()
		mock.ExpectQuery("INSERT INTO \"workout_exercises\" (.+) VALUES (.+)").WillReturnRows(workoutExerciseRows)
		mock.ExpectCommit()
		for j := 1; j <= 2; j++ {
			mock.ExpectBegin()
			mock.ExpectQuery("INSERT INTO \"logs\" (.+) VALUES (.+)").WillReturnRows(logRows)
			mock.ExpectCommit()
		}
	}
	mock.ExpectCommit()

	// Execute the method
	resp, err := svc.CreateWorkout(createWorkoutParams)

	// Assertions
	assert.Nil(t, err)
	assert.NotNil(t, resp)
	assert.Equal(t, createWorkoutParams.UserID, resp.Workout.UserID)
	assert.Equal(t, createWorkoutParams.StartedAt, resp.Workout.StartedAt)
	assert.Equal(t, createWorkoutParams.EndedAt, resp.Workout.EndedAt)
	assert.Len(t, resp.Logs, 4) // Expecting 2 logs for each of the 2 exercises

	// Check if all expectations were met
	assert.Nil(t, mock.ExpectationsWereMet())
}

func TestGetWorkouts(t *testing.T) {
	// Initialize mock db
	sqlDB, db, mock := mock.NewMockDB(t)
	svc := services.NewWorkoutService(db)

	defer sqlDB.Close()

	// Define test data
	now := time.Now()
	createWorkoutParams := &services.CreateWorkoutParams{
		UserID:      "123",
		StartedAt:   now,
		EndedAt:     now.Add(time.Hour), // Assuming workout duration is one hour
		ExerciseIds: []int{1, 2},        // Assuming two exercises
		Logs: map[int][]services.Log{
			1: {
				{Weight: 50, Reps: 10, Time: 30}, // Sample log for exercise ID 1
				{Weight: 60, Reps: 12, Time: 35}, // Another sample log for exercise ID 1
			},
			2: {
				{Weight: 40, Reps: 8, Time: 25},  // Sample log for exercise ID 2
				{Weight: 45, Reps: 10, Time: 30}, // Another sample log for exercise ID 2
			},
		},
	}

	// create test workout
	workout, workoutExercises, logs := testutils.CreateTestWorkout(createWorkoutParams)

	// define rows
	workoutRows := mock.NewRows([]string{"id", "user_id", "started_at", "ended_at", "updated_at"})
	workoutExerciseRows := mock.NewRows([]string{"id", "workout_id", "exercise_id"})
	logRows := mock.NewRows([]string{"id", "workout_exercise_id", "set_number", "weight", "reps", "time"})

	// add rows
	workoutRows.AddRow(workout.ID, workout.UserID, workout.StartedAt, workout.EndedAt, workout.StartedAt)
	for _, workoutExercise := range workoutExercises {
		workoutExerciseRows.AddRow(workoutExercise.ID, workoutExercise.WorkoutID, workoutExercise.ExerciseID)
	}
	for _, log := range logs {
		logRows.AddRow(log.ID, log.WorkoutExerciseID, log.SetNumber, log.Weight, log.Reps, log.Time)
	}

	// start expectations TODO: lacking test for inner join
	mock.ExpectQuery("^SELECT (.+) FROM workouts*").
		WillReturnRows(sqlmock.NewRows([]string{"id", "started_at", "ended_at", "exercise_id", "weight", "reps", "time"}).
			AddRow(workout.ID, workout.StartedAt, workout.EndedAt, workoutExercises[0].ExerciseID, logs[0].Weight, logs[0].Reps, logs[0].Time))

	// Execute the method
	resp, err := svc.GetWorkouts(createWorkoutParams.UserID)

	assert.Nil(t, err)
	assert.NotNil(t, resp)

	assert.NotEmpty(t, resp.Workouts)
	assert.NotEmpty(t, resp.WorkoutLogs)
}

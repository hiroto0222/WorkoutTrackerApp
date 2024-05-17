package service_tests

import (
	"testing"

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

	// create test workout
	userID := "123"
	workout, workoutExercises, logs, createWorkoutParams := testutils.CreateTestWorkout(userID)

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

	// create test workout
	userID := "123"
	workout, workoutExercises, logs, createWorkoutParams := testutils.CreateTestWorkout(userID)

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

func TestDeleteWorkout(t *testing.T) {
	// Initialize mock db
	sqlDB, db, mock := mock.NewMockDB(t)
	svc := services.NewWorkoutService(db)

	defer sqlDB.Close()

	// create test workout
	userID := "123"
	workout, workoutExercises, logs, _ := testutils.CreateTestWorkout(userID)

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

	// expectations
	selectSQL := "SELECT (.+) FROM \"workouts\" WHERE id = (.+)"
	mock.ExpectQuery(selectSQL).WillReturnRows(workoutRows)

	deleteSQL := "DELETE FROM \"workouts\" WHERE \"workouts\".\"id\" = (.+)"
	mock.ExpectBegin()
	mock.ExpectExec(deleteSQL).WillReturnResult(sqlmock.NewResult(1, 1)) // Simulate one row affected by delete
	mock.ExpectCommit()

	// execute DeleteWorkout
	err := svc.DeleteWorkout(workout.ID.String(), workout.UserID)

	// assertion
	assert.Nil(t, err)
	assert.Nil(t, mock.ExpectationsWereMet())
}

package service_tests

import (
	"errors"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/services"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/assert"
)

func TestCreateWorkout(t *testing.T) {
	// create test workout
	userID := "123"
	workout, workoutExercises, logs, createWorkoutParams := testutils.CreateTestWorkout(userID)

	testCases := []struct {
		name            string
		setupMocks      func(sqlMock sqlmock.Sqlmock)
		checkAssertions func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.CreateWorkoutResponse)
	}{
		{
			name: "Success",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock sql rows
				workoutRows, workoutExerciseRows, logRows := testutils.CreateTestWorkoutSQLRows(sqlMock, workout, workoutExercises, logs)
				// start transaction
				sqlMock.ExpectBegin()
				// expect insert into workouts
				sqlMock.ExpectQuery("INSERT INTO \"workouts\" (.+) VALUES (.+)").WillReturnRows(workoutRows)
				// expect insert into workout_exercises
				for i := 1; i <= 2; i++ {
					sqlMock.ExpectQuery("INSERT INTO \"workout_exercises\" (.+) VALUES (.+)").WillReturnRows(workoutExerciseRows)
					for j := 1; j <= 2; j++ {
						sqlMock.ExpectQuery("INSERT INTO \"logs\" (.+) VALUES (.+)").WillReturnRows(logRows)
					}
				}
				// expect transaction commit
				sqlMock.ExpectCommit()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.CreateWorkoutResponse) {
				assert.Nil(t, err)
				assert.NotNil(t, resp)
				assert.Equal(t, createWorkoutParams.UserID, resp.Workout.UserID)
				assert.Equal(t, createWorkoutParams.StartedAt, resp.Workout.StartedAt)
				assert.Equal(t, createWorkoutParams.EndedAt, resp.Workout.EndedAt)
				assert.Len(t, resp.Logs, 4) // Expecting 2 logs for each of the 2 exercises
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name: "FailureToCreateWorkout",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// start transaction
				sqlMock.ExpectBegin()
				// expected error
				sqlMock.ExpectQuery("INSERT INTO \"workouts\" (.+) VALUES (.+)").WillReturnError(errors.New("failed to create workout"))
				// expect transaction rollback
				sqlMock.ExpectRollback()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.CreateWorkoutResponse) {
				assert.NotNil(t, err)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name: "FailureToCreateWorkoutExercise",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock sql rows
				workoutRows, _, _ := testutils.CreateTestWorkoutSQLRows(sqlMock, workout, workoutExercises, logs)
				// start transaction
				sqlMock.ExpectBegin()
				// expect insert into workouts
				sqlMock.ExpectQuery("INSERT INTO \"workouts\" (.+) VALUES (.+)").WillReturnRows(workoutRows)
				// expected error
				sqlMock.ExpectQuery("INSERT INTO \"workout_exercises\" (.+) VALUES (.+)").WillReturnError(errors.New("failed to create workout_exercise"))
				// expect transaction rollback
				sqlMock.ExpectRollback()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.CreateWorkoutResponse) {
				assert.NotNil(t, err)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name: "FailureToCreateLog",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock sql rows
				workoutRows, workoutExerciseRows, _ := testutils.CreateTestWorkoutSQLRows(sqlMock, workout, workoutExercises, logs)
				// start transaction
				sqlMock.ExpectBegin()
				// expect insert into workouts
				sqlMock.ExpectQuery("INSERT INTO \"workouts\" (.+) VALUES (.+)").WillReturnRows(workoutRows)
				// expect insert into workout_exercises
				sqlMock.ExpectQuery("INSERT INTO \"workout_exercises\" (.+) VALUES (.+)").WillReturnRows(workoutExerciseRows)
				// expect error
				sqlMock.ExpectQuery("INSERT INTO \"logs\" (.+) VALUES (.+)").WillReturnError(errors.New("failed to create log"))
				// expect transaction rollback
				sqlMock.ExpectRollback()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.CreateWorkoutResponse) {
				assert.NotNil(t, err)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name: "FailureToCommitTransaction",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock sql rows
				workoutRows, workoutExerciseRows, logRows := testutils.CreateTestWorkoutSQLRows(sqlMock, workout, workoutExercises, logs)
				// start transaction
				sqlMock.ExpectBegin()
				// expect insert into workouts
				sqlMock.ExpectQuery("INSERT INTO \"workouts\" (.+) VALUES (.+)").WillReturnRows(workoutRows)
				// expect insert into workout_exercises
				for i := 1; i <= 2; i++ {
					sqlMock.ExpectQuery("INSERT INTO \"workout_exercises\" (.+) VALUES (.+)").WillReturnRows(workoutExerciseRows)
					for j := 1; j <= 2; j++ {
						sqlMock.ExpectQuery("INSERT INTO \"logs\" (.+) VALUES (.+)").WillReturnRows(logRows)
					}
				}
				// exepect transaction commit error
				sqlMock.ExpectCommit().WillReturnError(errors.New("failed to commit transaction"))
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.CreateWorkoutResponse) {
				assert.NotNil(t, err)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Initialize mock db
			sqlDB, db, sqlMock := mock.NewMockDB(t)
			svc := services.NewWorkoutService(db)

			defer sqlDB.Close()

			// setup mocks
			tc.setupMocks(sqlMock)

			// execute CreateWorkout
			resp, err := svc.CreateWorkout(createWorkoutParams)

			// check assertions
			tc.checkAssertions(t, sqlMock, err, resp)
		})
	}
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

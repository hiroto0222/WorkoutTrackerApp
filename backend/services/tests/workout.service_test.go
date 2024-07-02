package service_tests

import (
	"errors"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	my_mocks "github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/services"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
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
				sqlMock.ExpectQuery("INSERT INTO \"workout_exercises\" (.+) VALUES (.+)").WillReturnRows(workoutExerciseRows)
				// expect insert into logs
				sqlMock.ExpectQuery("INSERT INTO \"logs\" (.+) VALUES (.+)").WillReturnRows(logRows)
				sqlMock.ExpectQuery("INSERT INTO \"logs\" (.+) VALUES (.+)").WillReturnRows(logRows)
				// expect transaction commit
				sqlMock.ExpectCommit()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.CreateWorkoutResponse) {
				assert.Nil(t, err)
				assert.NotNil(t, resp)

				// assert workout
				assert.Equal(t, createWorkoutParams.UserID, resp.Workout.UserID)
				assert.Equal(t, createWorkoutParams.StartedAt, resp.Workout.StartedAt)
				assert.Equal(t, createWorkoutParams.EndedAt, resp.Workout.EndedAt)

				// assert logs
				assert.Len(t, resp.Logs, 2)
				assert.Equal(t, workoutExercises[0].ExerciseID, resp.Logs[0].ExerciseId)
				assert.Equal(t, logs[0].Reps, resp.Logs[0].Reps)
				assert.Equal(t, logs[0].Time, resp.Logs[0].Time)
				assert.Equal(t, logs[0].Weight, resp.Logs[0].Weight)
				assert.Equal(t, logs[1].Reps, resp.Logs[1].Reps)
				assert.Equal(t, logs[1].Time, resp.Logs[1].Time)
				assert.Equal(t, logs[1].Weight, resp.Logs[1].Weight)

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
				sqlMock.ExpectQuery("INSERT INTO \"workout_exercises\" (.+) VALUES (.+)").WillReturnRows(workoutExerciseRows)
				// expect insert into logs
				sqlMock.ExpectQuery("INSERT INTO \"logs\" (.+) VALUES (.+)").WillReturnRows(logRows)
				sqlMock.ExpectQuery("INSERT INTO \"logs\" (.+) VALUES (.+)").WillReturnRows(logRows)
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
			sqlDB, db, sqlMock := my_mocks.NewMockDB(t)
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
	// create test workout
	userID := "123"
	workout, workoutExercises, logs, _ := testutils.CreateTestWorkout(userID)
	exerciseID := workoutExercises[0].ExerciseID

	testCases := []struct {
		name            string
		setupMocks      func(sqlMock sqlmock.Sqlmock)
		checkAssertions func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.GetWorkoutsResponse)
	}{
		{
			name: "Success",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock sql rows
				rows := sqlmock.NewRows([]string{"id", "started_at", "ended_at", "exercise_id", "weight", "reps", "time"})
				for _, log := range logs {
					rows.AddRow(workout.ID, workout.StartedAt, workout.EndedAt, workoutExercises[0].ExerciseID, log.Weight, log.Reps, log.Time)
				}

				sqlMock.ExpectQuery(`
					SELECT w.id, w.started_at, w.ended_at, we.exercise_id AS "exercise_id", l.weight, l.reps, l.time
					FROM workouts w
						INNER JOIN workout_exercises we
							ON we.workout_id = w.id AND w.user_id = \$1
						INNER JOIN logs l
							ON we.id = l.workout_exercise_id
					ORDER BY w.started_at DESC, we.id, l.set_number;
				`).WithArgs(userID).WillReturnRows(rows)
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.GetWorkoutsResponse) {
				assert.Nil(t, err)
				assert.NotNil(t, resp)
				assert.Nil(t, sqlMock.ExpectationsWereMet())

				// check correct workout response
				assert.Len(t, resp.Workouts, 1)
				assert.Equal(t, workout.ID, resp.Workouts[0].ID)
				assert.Equal(t, workout.StartedAt, resp.Workouts[0].StartedAt)
				assert.Equal(t, workout.EndedAt, resp.Workouts[0].EndedAt)

				// check correct logs
				respWorkoutLogs := resp.WorkoutLogs[workout.ID]
				assert.Len(t, logs, 2)
				assert.Equal(t, exerciseID, respWorkoutLogs[0].ExerciseId)
				assert.Equal(t, logs[0].Weight, respWorkoutLogs[0].Weight)
				assert.Equal(t, logs[0].Reps, respWorkoutLogs[0].Reps)
				assert.Equal(t, logs[0].Time, respWorkoutLogs[0].Time)
				assert.Equal(t, exerciseID, respWorkoutLogs[1].ExerciseId)
				assert.Equal(t, logs[1].Weight, respWorkoutLogs[1].Weight)
				assert.Equal(t, logs[1].Reps, respWorkoutLogs[1].Reps)
				assert.Equal(t, logs[1].Time, respWorkoutLogs[1].Time)
			},
		},
		{
			name: "FailureToQuery",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				sqlMock.ExpectQuery(`
					SELECT w.id, w.started_at, w.ended_at, we.exercise_id AS "exercise_id", l.weight, l.reps, l.time
					FROM workouts w
						INNER JOIN workout_exercises we
							ON we.workout_id = w.id AND w.user_id = \$1
						INNER JOIN logs l
							ON we.id = l.workout_exercise_id
					ORDER BY w.started_at DESC, we.id, l.set_number;
				`).WithArgs(userID).WillReturnError(errors.New("query error"))
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.GetWorkoutsResponse) {
				assert.NotNil(t, err)
				assert.Equal(t, err, errors.New("query error"))
				assert.Nil(t, resp)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name: "FailureToScanRow",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock sql rows with invalid fields
				rows := sqlmock.NewRows([]string{"id", "started_at", "ended_at", "exercise_id", "weight", "reps", "time"})
				for _, log := range logs {
					rows.AddRow(workout.ID, workout.StartedAt, workout.EndedAt, workoutExercises[0].ExerciseID, "invalid weight", log.Reps, log.Time)
				}

				sqlMock.ExpectQuery(`
					SELECT w.id, w.started_at, w.ended_at, we.exercise_id AS "exercise_id", l.weight, l.reps, l.time
					FROM workouts w
						INNER JOIN workout_exercises we
							ON we.workout_id = w.id AND w.user_id = \$1
						INNER JOIN logs l
							ON we.id = l.workout_exercise_id
					ORDER BY w.started_at DESC, we.id, l.set_number;
				`).WithArgs(userID).WillReturnRows(rows)
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *services.GetWorkoutsResponse) {
				assert.NotNil(t, err)
				assert.Equal(t, err.Error(), "sql: Scan error on column index 4, name \"weight\": converting driver.Value type string (\"invalid weight\") to a float64: invalid syntax")
				assert.Nil(t, resp)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Initialize mock db
			sqlDB, db, sqlMock := my_mocks.NewMockDB(t)
			svc := services.NewWorkoutService(db)

			defer sqlDB.Close()

			// setup mocks
			tc.setupMocks(sqlMock)

			// execute GetWorkouts
			resp, err := svc.GetWorkouts(userID)

			// check assertions
			tc.checkAssertions(t, sqlMock, err, resp)
		})
	}
}

func TestDeleteWorkout(t *testing.T) {
	// create test workout
	userID := "123"
	workout, workoutExercises, logs, _ := testutils.CreateTestWorkout(userID)

	testCases := []struct {
		name            string
		setupMocks      func(sqlMock sqlmock.Sqlmock)
		checkAssertions func(t *testing.T, sqlMock sqlmock.Sqlmock, err error)
	}{
		{
			name: "Success",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock sql rows
				workoutRows, _, _ := testutils.CreateTestWorkoutSQLRows(sqlMock, workout, workoutExercises, logs)
				// expect select query
				selectSQL := "SELECT (.+) FROM \"workouts\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WillReturnRows(workoutRows)
				// expect delete query
				deleteSQL := "DELETE FROM \"workouts\" WHERE \"workouts\".\"id\" = (.+)"
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(deleteSQL).WillReturnResult(sqlmock.NewResult(1, 1))
				sqlMock.ExpectCommit()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error) {
				assert.Nil(t, err)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name: "FailureWorkoutNotFound",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect select query
				selectSQL := "SELECT (.+) FROM \"workouts\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WithArgs(workout.ID.String()).WillReturnError(gorm.ErrRecordNotFound)
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error) {
				assert.NotNil(t, err)
				assert.Equal(t, err, gorm.ErrRecordNotFound)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name: "FailureToDelete",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock sql rows
				workoutRows, _, _ := testutils.CreateTestWorkoutSQLRows(sqlMock, workout, workoutExercises, logs)
				// expect select query
				selectSQL := "SELECT (.+) FROM \"workouts\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WillReturnRows(workoutRows)
				// expect delete query
				deleteSQL := "DELETE FROM \"workouts\" WHERE \"workouts\".\"id\" = (.+)"
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(deleteSQL).WillReturnError(errors.New("delete error"))
				sqlMock.ExpectRollback()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error) {
				assert.NotNil(t, err)
				assert.Equal(t, err, errors.New("delete error"))
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Initialize mock db
			sqlDB, db, sqlMock := my_mocks.NewMockDB(t)
			svc := services.NewWorkoutService(db)

			defer sqlDB.Close()

			// setup mocks
			tc.setupMocks(sqlMock)

			// execute DeleteWorkout
			err := svc.DeleteWorkout(workout.ID.String(), workout.UserID)

			// check assertions
			tc.checkAssertions(t, sqlMock, err)
		})
	}
}

package service_tests

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	my_mocks "github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/services"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/assert"
)

// TestGetExerices tests for successful query of getting all exerices
func TestGetExercises(t *testing.T) {
	// initialize mock db
	sqlDB, db, mock := my_mocks.NewMockDB(t)
	svc := services.NewExerciseService(db)

	defer sqlDB.Close()

	exerciseData := testutils.CreateTestExercises(t)

	exercises := sqlmock.NewRows([]string{"id", "name", "log_type"})
	for _, exercise := range exerciseData {
		exercises.AddRow(exercise.ID, exercise.Name, exercise.LogType)
	}

	// expectations
	expectedSQL := "SELECT (.+) FROM \"exercises\""
	mock.ExpectQuery(expectedSQL).WillReturnRows(exercises)

	// execute GetExercises
	_, err := svc.GetExercises()

	assert.Nil(t, err)
	assert.Nil(t, mock.ExpectationsWereMet())
}

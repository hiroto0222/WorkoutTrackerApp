package service_tests

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/services"
	"github.com/stretchr/testify/assert"
)

type exerciseData struct {
	Exercises []models.Exercise `json:"exercises"`
}

func TestGetExercises(t *testing.T) {
	// initialize mock db
	sqlDB, db, mock := mock.NewMockDB(t)
	svc := services.NewExerciseService(db)

	defer sqlDB.Close()

	// populate exercises with fixtures
	path, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	dir := filepath.Join(path, "..", "..", "/fixtures/exercises.json")

	data, err := os.ReadFile(dir)
	if err != nil {
		t.Fatal(err)
	}

	var exerciseData exerciseData
	err = json.Unmarshal([]byte(data), &exerciseData)
	if err != nil {
		t.Fatal(err)
	}

	exercises := sqlmock.NewRows([]string{"id", "name", "log_type"})
	for _, exercise := range exerciseData.Exercises {
		exercises.AddRow(exercise.ID, exercise.Name, exercise.LogType)
	}

	// expectations
	expectedSQL := "SELECT (.+) FROM \"exercises\""
	mock.ExpectQuery(expectedSQL).WillReturnRows(exercises)

	// execute GetExercises
	_, err = svc.GetExercises()

	assert.Nil(t, err)
	assert.Nil(t, mock.ExpectationsWereMet())
}

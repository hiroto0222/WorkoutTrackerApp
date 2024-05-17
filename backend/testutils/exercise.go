package testutils

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/hiroto0222/workout-tracker-app/models"
)

type exerciseData struct {
	Exercises []models.Exercise `json:"exercises"`
}

func CreateTestExercises(t *testing.T) []models.Exercise {
	// get exercise fixtures
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

	return exerciseData.Exercises
}

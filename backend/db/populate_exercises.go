package db

import (
	"encoding/json"
	"errors"
	"log"
	"os"

	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type exerciseData struct {
	Exercises []models.Exercise `json:"exercises"`
}

// populateExercises inserts/updates exercises table with fixtures
func populateExercises(db *gorm.DB) error {
	dir, err := os.Getwd()
	if err != nil {
		return err
	}

	data, err := os.ReadFile(dir + "/fixtures/exercises.json")
	if err != nil {
		return err
	}

	var exerciseData exerciseData
	err = json.Unmarshal([]byte(data), &exerciseData)
	if err != nil {
		return err
	}

	for _, exercise := range exerciseData.Exercises {
		log.Println("Inserting exercise: ", exercise.Name)
		var existingExercise models.Exercise

		// Check if exercise already exists
		if err := db.Where("id = ?", exercise.ID).First(&existingExercise).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// If exercises does not exist, create it
				if err := db.Create(&exercise).Error; err != nil {
					return err
				}
				log.Println("Exercise created successfully")
			} else {
				return err
			}
		} else {
			// Exercise exists, update if values have changed
			if !compareExercises(exercise, existingExercise) {
				if err := db.Model(&existingExercise).Updates(&exercise).Error; err != nil {
					return err
				}
				log.Println("Exercise updated successfully")
			} else {
				log.Println("Exercise already exists and values are the same, skipping...")
			}
		}
	}

	return nil
}

// compareExercises is a helper function to compare if two exercises have the same values
func compareExercises(exercise1, exercise2 models.Exercise) bool {
	return exercise1.ID == exercise2.ID && exercise1.Name == exercise2.Name
}

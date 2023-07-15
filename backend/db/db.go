package db

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/go-gormigrate/gormigrate/v2"
	"github.com/hiroto0222/workout-tracker-app/config"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db                *gorm.DB
	err               error
	CURR_MIGRATION_ID = "202307151424"
)

type exerciseData struct {
	Exercises []models.Exercise `json:"exercises"`
}

func Init(config config.Config) *gorm.DB {
	db, err = gorm.Open(postgres.Open(config.DBSource), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to DB")
	}

	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.Exercise{})
	db.AutoMigrate(&models.Workout{})
	db.AutoMigrate(&models.WorkoutExercise{})
	db.AutoMigrate(&models.Log{})

	// populate Exercise table with fixtures
	dir, err := os.Getwd()
	if err != nil {
		log.Fatalf("Could not get CWD, %v", err)
	}

	data, err := os.ReadFile(dir + "/fixtures/exercises.json")
	if err != nil {
		log.Fatalf("Could not load exercises.json, %v", err)
	}
	var exerciseData exerciseData
	err = json.Unmarshal([]byte(data), &exerciseData)
	if err != nil {
		log.Fatalf("Could not unmarshal exercises.json, %v", err)
	}

	// Check if the migration has already been applied
	var migrationID string
	db.Table("migrations").Select("id").Where("id = ?", CURR_MIGRATION_ID).Scan(&migrationID)
	if migrationID == CURR_MIGRATION_ID {
		fmt.Println("Exercise migration has already been applied. Skipping migration.")
	} else {
		m := gormigrate.New(db, gormigrate.DefaultOptions, []*gormigrate.Migration{
			{
				ID: "202307151424",
				Migrate: func(tx *gorm.DB) error {
					return tx.Create(&exerciseData.Exercises).Error
				},
			},
		})

		if err = m.Migrate(); err != nil {
			log.Fatalf("Could not migrate exercises: %v", err)
		}
	}

	fmt.Println("🚀 Connected successfully to DB")

	return db
}

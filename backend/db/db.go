package db

import (
	"fmt"
	"log"

	"github.com/hiroto0222/workout-tracker-app/config"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	db  *gorm.DB
	err error
)

func Init(config config.Config) *gorm.DB {
	db, err = gorm.Open(postgres.Open(config.DBSource), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to DB")
	}

	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.Exercise{})
	fmt.Println("🚀 Connected successfully to DB")

	return db
}

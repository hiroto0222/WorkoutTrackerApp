package testutils

import (
	"time"

	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/services"
)

// CreateTestUser returns a User and the associated CreateUserParams
func CreateTestUser() (*models.User, *services.CreateUserParams) {
	now := time.Now()
	createUserParams := &services.CreateUserParams{
		ID:       "123",
		Name:     "Test Name",
		Email:    "test@example.com",
		Role:     "user",
		Photo:    "photo.jpg",
		Verified: true,
		Provider: "email",
		Weight:   70.5,
		Height:   175.0,
	}

	user := models.User{
		ID:        createUserParams.ID,
		Name:      createUserParams.Name,
		Email:     createUserParams.Email,
		Role:      createUserParams.Role,
		Photo:     createUserParams.Photo,
		Verified:  createUserParams.Verified,
		Provider:  createUserParams.Provider,
		Weight:    createUserParams.Weight,
		Height:    createUserParams.Height,
		CreatedAt: now,
		UpdatedAt: now,
	}

	return &user, createUserParams
}

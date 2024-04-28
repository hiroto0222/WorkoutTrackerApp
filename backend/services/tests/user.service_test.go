package service_tests

import (
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/services"
	"github.com/hiroto0222/workout-tracker-app/utils"
	"github.com/stretchr/testify/assert"
)

func TestCreateUser(t *testing.T) {
	// initialize mock db
	mockAuthClient := &mock.MockAuthClient{}
	sqlDB, db, mock := mock.NewMockDB(t)
	svc := services.NewUserService(db, mockAuthClient)

	defer sqlDB.Close()

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

	// populate users
	users := mock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
	users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)

	// expectations
	mock.ExpectBegin()
	mock.ExpectExec("INSERT INTO \"users\" (.+) VALUES (.+)").
		WithArgs(createUserParams.ID, createUserParams.Name, createUserParams.Email,
			createUserParams.Role, createUserParams.Photo, createUserParams.Verified,
								createUserParams.Provider, createUserParams.Weight, createUserParams.Height, utils.AnyTime{}, utils.AnyTime{}).
		WillReturnResult(sqlmock.NewResult(1, 1)) // Simulate successful insertion of one row
	mock.ExpectCommit()

	// execute CreateUser
	_, err := svc.CreateUser(createUserParams)

	assert.Nil(t, err)
	assert.Nil(t, mock.ExpectationsWereMet())
}

package service_tests

import (
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/services"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/assert"
)

// TestCreateUser tests for successful insert of new user
func TestCreateUser(t *testing.T) {
	// initialize mock db
	mockAuthClient := &mock.MockAuthClient{}
	sqlDB, db, mock := mock.NewMockDB(t)
	svc := services.NewUserService(db, mockAuthClient)

	defer sqlDB.Close()

	user, createUserParams := testutils.CreateTestUser()

	// populate users
	users := mock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
	users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)

	// expectations
	mock.ExpectBegin()
	mock.ExpectExec("INSERT INTO \"users\" (.+) VALUES (.+)").
		WithArgs(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified,
								user.Provider, user.Weight, user.Height, testutils.AnyTime{}, testutils.AnyTime{}).
		WillReturnResult(sqlmock.NewResult(1, 1)) // Simulate successful insertion of one row
	mock.ExpectCommit()

	// execute CreateUser
	_, err := svc.CreateUser(createUserParams)

	// assertion
	assert.Nil(t, err)
	assert.Nil(t, mock.ExpectationsWereMet())
}

// TestGetUser tests for successful query of getting a user
func TestGetUser(t *testing.T) {
	// initialize mock db
	mockAuthClient := &mock.MockAuthClient{}
	sqlDB, db, mock := mock.NewMockDB(t)
	svc := services.NewUserService(db, mockAuthClient)

	defer sqlDB.Close()

	user, _ := testutils.CreateTestUser()

	// populate users
	users := mock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
	users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)

	// expectations
	expectedSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
	mock.ExpectQuery(expectedSQL).WillReturnRows(users)

	// execute GetUser
	_, err := svc.GetUser(user.ID)

	// assertion
	assert.Nil(t, err)
	assert.Nil(t, mock.ExpectationsWereMet())
}

// TestUpdateUser tests for successful query of updating a user
func TestUpdateUser(t *testing.T) {
	// initialize mock db
	mockAuthClient := &mock.MockAuthClient{}
	sqlDB, db, mock := mock.NewMockDB(t)
	svc := services.NewUserService(db, mockAuthClient)

	defer sqlDB.Close()

	user, _ := testutils.CreateTestUser()

	// populate users
	users := mock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
	users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)

	// expectations
	selectSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
	mock.ExpectQuery(selectSQL).WillReturnRows(users)

	updateSQL := "UPDATE \"users\" SET .+"
	mock.ExpectBegin()
	mock.ExpectExec(updateSQL).WillReturnResult(sqlmock.NewResult(1, 1)) // Simulate one row affected by the update
	mock.ExpectCommit()

	// execute GetUser
	err := svc.UpdateUser(user.ID, "Updated Name", 45, 160)

	// assertion
	assert.Nil(t, err)
	assert.Nil(t, mock.ExpectationsWereMet())
}

// TestDeleteUser tests for successful query of deleting a user
func TestDeleteUser(t *testing.T) {
	// initialize mock db
	mockAuthClient := &mock.MockAuthClient{}
	sqlDB, db, mock := mock.NewMockDB(t)
	svc := services.NewUserService(db, mockAuthClient)

	// create mock context
	mockCtx, _ := gin.CreateTestContext(httptest.NewRecorder())

	defer sqlDB.Close()

	user, _ := testutils.CreateTestUser()

	// populate users
	users := mock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
	users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)

	// expectations
	selectSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
	mock.ExpectQuery(selectSQL).WillReturnRows(users)

	deleteSQL := "DELETE FROM \"users\" WHERE \"users\".\"id\" = (.+)"
	mock.ExpectBegin()
	mock.ExpectExec(deleteSQL).WillReturnResult(sqlmock.NewResult(1, 1)) // Simulate one row affected by the update
	mock.ExpectCommit()

	// execute GetUser
	err := svc.DeleteUser(mockCtx, user.ID)

	// assertion
	assert.Nil(t, err)
	assert.Nil(t, mock.ExpectationsWereMet())
}

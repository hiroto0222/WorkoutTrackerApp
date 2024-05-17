package service_tests

import (
	"errors"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/services"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestCreateUser(t *testing.T) {
	user, createUserParams := testutils.CreateTestUser()

	testCases := []struct {
		name            string
		setupMocks      func(sqlMock sqlmock.Sqlmock)
		checkAssertions func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *models.User)
	}{
		{
			name: "Success",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect insert
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec("INSERT INTO \"users\" (.+) VALUES (.+)").
					WithArgs(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified,
						user.Provider, user.Weight, user.Height, testutils.AnyTime{}, testutils.AnyTime{}).
					WillReturnResult(sqlmock.NewResult(1, 1))
				sqlMock.ExpectCommit()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *models.User) {
				assert.Nil(t, err)
				assert.Nil(t, sqlMock.ExpectationsWereMet())

				assert.Equal(t, user.ID, resp.ID)
				assert.Equal(t, user.Name, resp.Name)
				assert.Equal(t, user.Email, resp.Email)
				assert.Equal(t, user.Photo, resp.Photo)
				assert.Equal(t, user.Provider, resp.Provider)
				assert.Equal(t, user.Weight, resp.Weight)
				assert.Equal(t, user.Height, resp.Height)
			},
		},
		{
			name: "Failure",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect insert
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec("INSERT INTO \"users\" (.+) VALUES (.+)").
					WithArgs(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified,
						user.Provider, user.Weight, user.Height, testutils.AnyTime{}, testutils.AnyTime{}).
					WillReturnError(errors.New("create error"))
				sqlMock.ExpectRollback()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *models.User) {
				assert.NotNil(t, err)
				assert.Equal(t, err, errors.New("create error"))
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// initialize mock db
			mockAuthClient := &mock.MockAuthClient{}
			sqlDB, db, sqlMock := mock.NewMockDB(t)
			svc := services.NewUserService(db, mockAuthClient)

			defer sqlDB.Close()

			// setup mocks
			tc.setupMocks(sqlMock)

			// execute CreateUser
			resp, err := svc.CreateUser(createUserParams)

			// check assertions
			tc.checkAssertions(t, sqlMock, err, resp)
		})
	}
}

// TestGetUser tests for successful query of getting a user
func TestGetUser(t *testing.T) {
	user, _ := testutils.CreateTestUser()

	testCases := []struct {
		name            string
		setupMocks      func(sqlMock sqlmock.Sqlmock)
		checkAssertions func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *models.User)
	}{
		{
			name: "Success",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock rows
				users := sqlMock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
				users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)
				// expect select
				expectedSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
				sqlMock.ExpectQuery(expectedSQL).WithArgs(user.ID).WillReturnRows(users)
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *models.User) {
				assert.Nil(t, err)
				assert.Nil(t, sqlMock.ExpectationsWereMet())

				assert.Equal(t, user.ID, resp.ID)
				assert.Equal(t, user.Name, resp.Name)
				assert.Equal(t, user.Email, resp.Email)
				assert.Equal(t, user.Photo, resp.Photo)
				assert.Equal(t, user.Provider, resp.Provider)
				assert.Equal(t, user.Weight, resp.Weight)
				assert.Equal(t, user.Height, resp.Height)
			},
		},
		{
			name: "Failure",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect error
				expectedSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
				sqlMock.ExpectQuery(expectedSQL).WithArgs(user.ID).WillReturnError(errors.New("get error"))
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error, resp *models.User) {
				assert.NotNil(t, err)
				assert.Equal(t, err, errors.New("get error"))
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// initialize mock db
			mockAuthClient := &mock.MockAuthClient{}
			sqlDB, db, sqlMock := mock.NewMockDB(t)
			svc := services.NewUserService(db, mockAuthClient)

			defer sqlDB.Close()

			// setup mocks
			tc.setupMocks(sqlMock)

			// execute GetUser
			resp, err := svc.GetUser(user.ID)

			// check assertions
			tc.checkAssertions(t, sqlMock, err, resp)
		})
	}
}

func TestUpdateUser(t *testing.T) {
	user, _ := testutils.CreateTestUser()

	testCases := []struct {
		name            string
		setupMocks      func(sqlMock sqlmock.Sqlmock)
		checkAssertions func(t *testing.T, sqlMock sqlmock.Sqlmock, err error)
	}{
		{
			name: "Success",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock rows
				users := sqlMock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
				users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)
				// expect select
				selectSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WithArgs(user.ID).WillReturnRows(users)
				// expect update
				updateSQL := "UPDATE \"users\" SET .+"
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(updateSQL).WillReturnResult(sqlmock.NewResult(1, 1)) // Simulate one row affected by the update
				sqlMock.ExpectCommit()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error) {
				assert.Nil(t, err)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name: "FailureRecordNotFound",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect error
				selectSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WithArgs(user.ID).WillReturnError(gorm.ErrRecordNotFound)
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error) {
				assert.NotNil(t, err)
				assert.Equal(t, err, gorm.ErrRecordNotFound)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name: "FailureUpdatingUser",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock rows
				users := sqlMock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
				users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)
				// expect select
				selectSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WithArgs(user.ID).WillReturnRows(users)
				// expect error
				updateSQL := "UPDATE \"users\" SET .+"
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(updateSQL).WillReturnError(errors.New("update error"))
				sqlMock.ExpectRollback()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error) {
				assert.NotNil(t, err)
				assert.Equal(t, err, errors.New("update error"))
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// initialize mock db
			mockAuthClient := &mock.MockAuthClient{}
			sqlDB, db, sqlMock := mock.NewMockDB(t)
			svc := services.NewUserService(db, mockAuthClient)

			defer sqlDB.Close()

			// setup mocks
			tc.setupMocks(sqlMock)

			// execute UpdateUser
			err := svc.UpdateUser(user.ID, "Updated Name", 45, 160)

			// check assertions
			tc.checkAssertions(t, sqlMock, err)
		})
	}
}

func TestDeleteUser(t *testing.T) {
	user, _ := testutils.CreateTestUser()

	testCases := []struct {
		name                      string
		authClientDeleteUserError error
		setupMocks                func(sqlMock sqlmock.Sqlmock)
		checkAssertions           func(t *testing.T, sqlMock sqlmock.Sqlmock, err error)
	}{
		{
			name:                      "Success",
			authClientDeleteUserError: nil,
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock rows
				users := sqlMock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
				users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)
				// expect select
				selectSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WillReturnRows(users)
				// expect delete
				deleteSQL := "DELETE FROM \"users\" WHERE \"users\".\"id\" = (.+)"
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(deleteSQL).WillReturnResult(sqlmock.NewResult(1, 1)) // Simulate one row affected by the update
				sqlMock.ExpectCommit()
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error) {
				assert.Nil(t, err)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name:                      "FailureRecordNotFound",
			authClientDeleteUserError: nil,
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect error
				selectSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WillReturnError(gorm.ErrRecordNotFound)
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error) {
				assert.NotNil(t, err)
				assert.Equal(t, err, gorm.ErrRecordNotFound)
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name:                      "FailureFirebase",
			authClientDeleteUserError: errors.New("firebase error"),
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock rows
				users := sqlMock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
				users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)
				// expect select
				selectSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WillReturnRows(users)
			},
			checkAssertions: func(t *testing.T, sqlMock sqlmock.Sqlmock, err error) {
				assert.NotNil(t, err)
				assert.Equal(t, err, errors.New("firebase error"))
				assert.Nil(t, sqlMock.ExpectationsWereMet())
			},
		},
		{
			name:                      "FailureDelete",
			authClientDeleteUserError: nil,
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// create mock rows
				users := sqlMock.NewRows([]string{"id", "name", "email", "role", "photo", "verified", "provider", "weight", "height", "created_at", "updated_at"})
				users.AddRow(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified, user.Provider, user.Weight, user.Height, user.CreatedAt, user.UpdatedAt)
				// expect select
				selectSQL := "SELECT (.+) FROM \"users\" WHERE id = (.+)"
				sqlMock.ExpectQuery(selectSQL).WillReturnRows(users)
				// expect error
				deleteSQL := "DELETE FROM \"users\" WHERE \"users\".\"id\" = (.+)"
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
			// create mock context
			mockCtx, _ := gin.CreateTestContext(httptest.NewRecorder())

			// initialize mock auth client
			mockAuthClient := &mock.MockAuthClient{}
			mockAuthClient.On("DeleteUser", mockCtx, user.ID).Return(tc.authClientDeleteUserError)

			// initialize mock db
			sqlDB, db, sqlMock := mock.NewMockDB(t)
			svc := services.NewUserService(db, mockAuthClient)

			defer sqlDB.Close()

			// setup mocks
			tc.setupMocks(sqlMock)

			// execute UpdateUser
			err := svc.DeleteUser(mockCtx, user.ID)

			// check assertions
			tc.checkAssertions(t, sqlMock, err)
		})
	}
}

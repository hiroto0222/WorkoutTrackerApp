package controller_tests

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"firebase.google.com/go/auth"
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	my_mocks "github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestCreateUser(t *testing.T) {
	user, _ := testutils.CreateTestUser()

	testCases := []struct {
		name            string
		body            gin.H
		setupAuth       func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, request *http.Request)
		setupMocks      func(sqlMock sqlmock.Sqlmock)
		checkAssertions func(t *testing.T, recorder *httptest.ResponseRecorder)
	}{
		{
			name: "Success",
			body: gin.H{
				"id":       user.ID,
				"name":     user.Name,
				"email":    user.Email,
				"role":     user.Role,
				"photo":    user.Photo,
				"verified": user.Verified,
				"provider": user.Provider,
				"weight":   user.Weight,
				"height":   user.Height,
			},
			setupAuth: func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, request *http.Request) {
				authToken := "valid-token"
				request.Header.Set("Authorization", "Bearer "+authToken)
				mockAuthClient.On("VerifyIDToken", mock.Anything, authToken).Return(&auth.Token{UID: user.ID}, nil)
			},
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect insert
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec("INSERT INTO \"users\" (.+) VALUES (.+)").
					WithArgs(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified,
						user.Provider, user.Weight, user.Height, testutils.AnyTime{}, testutils.AnyTime{}).
					WillReturnResult(sqlmock.NewResult(1, 1))
				sqlMock.ExpectCommit()
			},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusCreated, recorder.Code)
				requireBodyMatchUser(t, recorder.Body, user)
			},
		},
		{
			name: "FailureShouldBindJson",
			body: gin.H{
				"id":   user.ID,
				"name": user.Name,
			},
			setupAuth: func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, request *http.Request) {
				authToken := "valid-token"
				request.Header.Set("Authorization", "Bearer "+authToken)
				mockAuthClient.On("VerifyIDToken", mock.Anything, authToken).Return(&auth.Token{UID: user.ID}, nil)
			},
			setupMocks: func(sqlMock sqlmock.Sqlmock) {},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "FailureNoAuth",
			body: gin.H{
				"id":       user.ID,
				"name":     user.Name,
				"email":    user.Email,
				"role":     user.Role,
				"photo":    user.Photo,
				"verified": user.Verified,
				"provider": user.Provider,
				"weight":   user.Weight,
				"height":   user.Height,
			},
			setupAuth:  func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, request *http.Request) {},
			setupMocks: func(sqlMock sqlmock.Sqlmock) {},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "FailureNoPermission",
			body: gin.H{
				"id":       user.ID,
				"name":     user.Name,
				"email":    user.Email,
				"role":     user.Role,
				"photo":    user.Photo,
				"verified": user.Verified,
				"provider": user.Provider,
				"weight":   user.Weight,
				"height":   user.Height,
			},
			setupAuth: func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, request *http.Request) {
				authToken := "valid-token"
				request.Header.Set("Authorization", "Bearer "+authToken)
				mockAuthClient.On("VerifyIDToken", mock.Anything, authToken).Return(&auth.Token{UID: "789"}, nil)
			},
			setupMocks: func(sqlMock sqlmock.Sqlmock) {},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "FailureDuplicateEmail",
			body: gin.H{
				"id":       user.ID,
				"name":     user.Name,
				"email":    user.Email,
				"role":     user.Role,
				"photo":    user.Photo,
				"verified": user.Verified,
				"provider": user.Provider,
				"weight":   user.Weight,
				"height":   user.Height,
			},
			setupAuth: func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, request *http.Request) {
				authToken := "valid-token"
				request.Header.Set("Authorization", "Bearer "+authToken)
				mockAuthClient.On("VerifyIDToken", mock.Anything, authToken).Return(&auth.Token{UID: user.ID}, nil)
			},
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect insert
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec("INSERT INTO \"users\" (.+) VALUES (.+)").
					WithArgs(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified,
						user.Provider, user.Weight, user.Height, testutils.AnyTime{}, testutils.AnyTime{}).
					WillReturnError(errors.New("UNIQUE constraint failed: users.email"))
				sqlMock.ExpectRollback()
			},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusBadRequest, recorder.Code)
			},
		},
		{
			name: "FailureCreateUser",
			body: gin.H{
				"id":       user.ID,
				"name":     user.Name,
				"email":    user.Email,
				"role":     user.Role,
				"photo":    user.Photo,
				"verified": user.Verified,
				"provider": user.Provider,
				"weight":   user.Weight,
				"height":   user.Height,
			},
			setupAuth: func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, request *http.Request) {
				authToken := "valid-token"
				request.Header.Set("Authorization", "Bearer "+authToken)
				mockAuthClient.On("VerifyIDToken", mock.Anything, authToken).Return(&auth.Token{UID: user.ID}, nil)
			},
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect insert
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec("INSERT INTO \"users\" (.+) VALUES (.+)").
					WithArgs(user.ID, user.Name, user.Email, user.Role, user.Photo, user.Verified,
						user.Provider, user.Weight, user.Height, testutils.AnyTime{}, testutils.AnyTime{}).
					WillReturnError(errors.New("create user error"))
				sqlMock.ExpectRollback()
			},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusInternalServerError, recorder.Code)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// initialize mock db
			sqlDB, db, sqlMock := my_mocks.NewMockDB(t)
			defer sqlDB.Close()

			// initialize mock auth client
			mockAuthClient := &my_mocks.MockAuthClient{}

			// setup sql mocks
			tc.setupMocks(sqlMock)

			// create test http server and recorder
			server := testutils.NewTestServer(t, db, mockAuthClient)
			recorder := httptest.NewRecorder()

			// create test url and data
			url := "/api/v1/users/create"
			data, err := json.Marshal(tc.body)
			require.NoError(t, err)

			// create test request
			request, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(data))
			require.NoError(t, err)

			// initialize auth in request context
			tc.setupAuth(t, mockAuthClient, request)

			// execute request
			server.Router.ServeHTTP(recorder, request)

			// check assertions
			tc.checkAssertions(t, recorder)
		})
	}
}

func requireBodyMatchUser(t *testing.T, body *bytes.Buffer, wantUser models.User) {
	data, err := io.ReadAll(body)
	require.NoError(t, err)

	var gotUser models.User
	err = json.Unmarshal(data, &gotUser)

	require.NoError(t, err)
	require.Equal(t, gotUser.ID, wantUser.ID)
	require.Equal(t, gotUser.Name, wantUser.Name)
	require.Equal(t, gotUser.Email, wantUser.Email)
}

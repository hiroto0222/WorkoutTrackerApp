package controller_tests

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/hiroto0222/workout-tracker-app/controllers"
	my_mocks "github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/require"
)

func TestGetExercises(t *testing.T) {
	exerciseData := testutils.CreateTestExercises(t)

	testCases := []struct {
		name            string
		setupMocks      func(sqlMock sqlmock.Sqlmock)
		checkAssertions func(t *testing.T, recorder *httptest.ResponseRecorder)
	}{
		{
			name: "Success",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// mock rows
				exercises := sqlmock.NewRows([]string{"id", "name", "log_type"})
				for _, exercise := range exerciseData {
					exercises.AddRow(exercise.ID, exercise.Name, exercise.LogType)
				}
				// expectations
				expectedSQL := "SELECT (.+) FROM \"exercises\""
				sqlMock.ExpectQuery(expectedSQL).WillReturnRows(exercises)
			},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
				requireBodyMatchExercises(t, recorder.Body, exerciseData)
			},
		},
		{
			name: "Failure",
			setupMocks: func(sqlMock sqlmock.Sqlmock) {
				// expect error
				expectedSQL := "SELECT (.+) FROM \"exercises\""
				sqlMock.ExpectQuery(expectedSQL).WillReturnError(errors.New("get exercises error"))
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

			// create test url
			url := "/api/v1/exercises"

			// create test request
			request, err := http.NewRequest(http.MethodGet, url, nil)
			require.NoError(t, err)

			// execute request
			server.Router.ServeHTTP(recorder, request)
			tc.checkAssertions(t, recorder)
		})
	}
}

func requireBodyMatchExercises(t *testing.T, body *bytes.Buffer, wantExercises []models.Exercise) {
	data, err := io.ReadAll(body)
	require.NoError(t, err)

	var respBody controllers.GetExercisesResponse
	err = json.Unmarshal(data, &respBody)

	require.NoError(t, err)
	require.Equal(t, respBody.Data, wantExercises)
}

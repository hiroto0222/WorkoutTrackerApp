package controller_tests

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/hiroto0222/workout-tracker-app/controllers"
	my_mocks "github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/require"
)

type exerciseData struct {
	Exercises []models.Exercise `json:"exercises"`
}

func TestGetExercises(t *testing.T) {
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
				for _, exercise := range exerciseData.Exercises {
					exercises.AddRow(exercise.ID, exercise.Name, exercise.LogType)
				}
				// expectations
				expectedSQL := "SELECT (.+) FROM \"exercises\""
				sqlMock.ExpectQuery(expectedSQL).WillReturnRows(exercises)
			},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
				requireBodyMatchExercises(t, recorder.Body, exerciseData.Exercises)
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

			// setup sql mocks
			tc.setupMocks(sqlMock)

			// create test http server and recorder
			server := testutils.NewTestServer(t, db)
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

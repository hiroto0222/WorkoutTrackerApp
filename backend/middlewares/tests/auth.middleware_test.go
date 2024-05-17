package middleware_tests

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"firebase.google.com/go/auth"
	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/middlewares"
	my_mocks "github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func TestAuthMiddleware(t *testing.T) {
	testCases := []struct {
		name            string
		setupAuth       func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, ctx context.Context, request *http.Request)
		checkAssertions func(t *testing.T, recorder *httptest.ResponseRecorder)
	}{
		{
			name: "Success",
			setupAuth: func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, ctx context.Context, request *http.Request) {
				authToken := "valid-token"
				request.Header.Set("Authorization", "Bearer "+authToken)
				mockAuthClient.On("VerifyIDToken", mock.Anything, authToken).Return(&auth.Token{UID: "123"}, nil)
			},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusOK, recorder.Code)
			},
		},
		{
			name: "FailureTokenEmpty",
			setupAuth: func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, ctx context.Context, request *http.Request) {
				authToken := ""
				request.Header.Set("Authorization", "Bearer "+authToken)
			},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
		{
			name: "FailureInvalidToken",
			setupAuth: func(t *testing.T, mockAuthClient *my_mocks.MockAuthClient, ctx context.Context, request *http.Request) {
				authToken := "invalid-token"
				request.Header.Set("Authorization", "Bearer "+authToken)
				mockAuthClient.On("VerifyIDToken", mock.Anything, authToken).Return(nil, assert.AnError)
			},
			checkAssertions: func(t *testing.T, recorder *httptest.ResponseRecorder) {
				require.Equal(t, http.StatusUnauthorized, recorder.Code)
			},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// create mock context
			mockCtx, _ := gin.CreateTestContext(httptest.NewRecorder())

			// create test http server and recorder
			server := testutils.NewTestServer(t, nil)
			recorder := httptest.NewRecorder()

			// initialize mock auth client
			mockAuthClient := &my_mocks.MockAuthClient{}

			// create test auth required path
			authRequiredPath := "/api/authrequired"
			server.Router.GET(
				authRequiredPath,
				middlewares.AuthMiddleware(mockAuthClient),
				func(ctx *gin.Context) {
					ctx.JSON(http.StatusOK, gin.H{})
				},
			)

			// create test request
			request, err := http.NewRequest(http.MethodGet, authRequiredPath, nil)
			require.NoError(t, err)

			// initialize auth in request context
			tc.setupAuth(t, mockAuthClient, mockCtx, request)

			// serve http
			server.Router.ServeHTTP(recorder, request)

			// check assertions
			tc.checkAssertions(t, recorder)
		})
	}
}

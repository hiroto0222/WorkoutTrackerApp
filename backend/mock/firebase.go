package mock

import (
	"context"

	"firebase.google.com/go/auth"
	"github.com/stretchr/testify/mock"
)

// Mock for Client Firebase Auth Service
// Matches abstract interface delcared by user.service
type MockAuthClient struct {
	mock.Mock
}

// DeleteUser mocks the DeleteUser method of the Firebase AuthClient interface.
func (m *MockAuthClient) DeleteUser(ctx context.Context, uid string) error {
	args := m.Called(ctx, uid)
	return args.Error(0)
}

// VerifyIDToken mocks the VerifyIDToken method of the Firebase AuthClient interface.
func (m *MockAuthClient) VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
	args := m.Called(ctx, idToken)
	if token, ok := args.Get(0).(*auth.Token); ok {
		return token, args.Error(1)
	}
	return nil, args.Error(1)
}

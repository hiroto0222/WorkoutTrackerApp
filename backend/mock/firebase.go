package mock

import (
	"context"
)

// Mock for Client Firebase Auth Service
// Matches abstract interface delcared by user.service
type MockAuthClient struct{}

func (c *MockAuthClient) DeleteUser(ctx context.Context, uid string) error {
	return nil
}

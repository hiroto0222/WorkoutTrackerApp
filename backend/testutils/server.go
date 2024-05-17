package testutils

import (
	"testing"

	"github.com/hiroto0222/workout-tracker-app/config"
	"github.com/hiroto0222/workout-tracker-app/mock"
	"github.com/hiroto0222/workout-tracker-app/server"
	"gorm.io/gorm"
)

func NewTestServer(t *testing.T, db *gorm.DB) *server.Server {
	conf := config.Config{
		Origin: "*", // テスト時は CORS を無効にする
	}

	mockAuthClient := &mock.MockAuthClient{}

	server := server.NewServer(conf, db, mockAuthClient)

	return server
}

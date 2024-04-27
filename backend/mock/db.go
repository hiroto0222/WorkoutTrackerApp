package mock

import (
	"database/sql"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewMockDB(t *testing.T) (*sql.DB, *gorm.DB, sqlmock.Sqlmock) {
	// create mock sql db
	sqldb, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}

	// create gorm connection with mock sql db
	gormdb, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqldb,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		t.Fatal(err)
	}

	return sqldb, gormdb, mock
}

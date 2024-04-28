package utils

import (
	"database/sql/driver"
	"time"
)

// Match satisfies sqlmock.Argument interface
// Allows for comparison of different Time.time to be of anytime
type AnyTime struct{}

func (a AnyTime) Match(v driver.Value) bool {
	_, ok := v.(time.Time)
	return ok
}

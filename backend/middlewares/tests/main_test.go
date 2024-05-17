package middleware_tests

import (
	"os"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestMain(m *testing.M) {
	// test ci comment
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}

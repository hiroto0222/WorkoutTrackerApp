package server

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/config"
	"gorm.io/gorm"
)

type Server struct {
	Config config.Config
	DB     *gorm.DB
	Router *gin.Engine
}

func NewServer(config config.Config, db *gorm.DB) *Server {
	server := &Server{
		Config: config,
		DB:     db,
	}
	server.setupRouter()
	return server
}

// setupRouter sets up the HTTP router for all api endpoints
func (server *Server) setupRouter() {
	router := gin.Default()

	apiRoutes := router.Group("/api/v1")
	apiRoutes.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "service is healthy",
		})
	})

	server.Router = router
}

// Start runs the HTTP server on config port
func (server *Server) Start() error {
	fmt.Println("server listening on port", server.Config.Port)
	return server.Router.Run(":" + server.Config.Port)
}

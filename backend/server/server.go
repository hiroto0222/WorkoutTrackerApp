package server

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"firebase.google.com/go/auth"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/config"
	"github.com/hiroto0222/workout-tracker-app/controllers"
	"github.com/hiroto0222/workout-tracker-app/middleware"
	services "github.com/hiroto0222/workout-tracker-app/services/auth"
	"gorm.io/gorm"
)

var UserController controllers.UserController

type Server struct {
	Config   config.Config
	DB       *gorm.DB
	Router   *gin.Engine
	FireAuth *auth.Client
}

func NewServer(conf config.Config, db *gorm.DB) *Server {
	server := &Server{
		Config: conf,
		DB:     db,
	}

	authClient, err := config.InitAuth()
	if err != nil {
		log.Fatal("failed to create firebase auth instance")
	}
	server.FireAuth = authClient

	UserController = *controllers.NewUserController(db)

	server.setupRouter()
	return server
}

// setupRouter sets up the HTTP router for all api endpoints
func (server *Server) setupRouter() {
	router := gin.Default()

	// setup cors
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{server.Config.Origin},
		AllowMethods:     []string{"GET", "POST", "OPTIONS", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge: 15 * time.Second,
	}))

	authService := &services.AuthService{
		DB:       server.DB,
		FireAuth: server.FireAuth,
	}

	apiRoutes := router.Group("/api/v1")
	apiRoutes.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "service is healthy",
		})
	})

	apiRoutes.GET("/user/me", middleware.AuthMiddleware(authService), UserController.GetUser)

	server.Router = router
}

// Start runs the HTTP server on config port
func (server *Server) Start() error {
	fmt.Println("server listening on port", server.Config.Port)
	return server.Router.Run(":" + server.Config.Port)
}

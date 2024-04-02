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
	"github.com/hiroto0222/workout-tracker-app/middlewares"
	"github.com/hiroto0222/workout-tracker-app/services"
	"gorm.io/gorm"
)

var (
	userService        services.UserServiceImpl
	userController     controllers.UserControllerImpl
	workoutService     services.WorkoutServiceImpl
	workoutController  controllers.WorkoutControllerImpl
	exerciseService    services.ExerciseServiceImpl
	exerciseController controllers.ExerciseControllerImpl
)

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

	// init Firebase auth client
	authClient, err := config.InitAuth(conf)
	if err != nil {
		log.Fatal("failed to create firebase auth instance")
	}
	server.FireAuth = authClient

	// init services
	userService = *services.NewUserService(server.DB)
	workoutService = *services.NewWorkoutService(server.DB)
	exerciseService = *services.NewExerciseService(server.DB)

	// init controllers
	userController = *controllers.NewUserController(&userService)
	workoutController = *controllers.NewWorkoutController(&workoutService)
	exerciseController = *controllers.NewExerciseController(&exerciseService)

	// init router
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

	// health check route
	apiRoutes := router.Group("/api/v1")
	apiRoutes.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "service is healthy",
		})
	})

	// authentication routes
	{
		userRoutes := apiRoutes.Group("/user")
		userRoutes.Use(middlewares.AuthMiddleware(server.FireAuth))
		userRoutes.GET("/me", userController.GetUser)
		userRoutes.POST("/create", userController.CreateUser)
	}

	// workout routes
	{
		workoutRoutes := apiRoutes.Group("/workout")
		workoutRoutes.Use(middlewares.AuthMiddleware(server.FireAuth))
		workoutRoutes.POST("/create", workoutController.CreateWorkout)
		workoutRoutes.POST("/delete", workoutController.DeleteWorkout)
	}

	// exercise routes
	{
		exerciseRoutes := apiRoutes.Group("/exercises")
		exerciseRoutes.GET("", exerciseController.GetExercises)
	}

	server.Router = router
}

// Start runs the HTTP server on config port
func (server *Server) Start() error {
	fmt.Println("server listening on port", server.Config.Port)
	return server.Router.Run(":" + server.Config.Port)
}

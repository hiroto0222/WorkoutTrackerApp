package server

import (
	"fmt"
	"net/http"
	"time"

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
	FireAuth config.AuthClient
}

func NewServer(conf config.Config, db *gorm.DB, authClient config.AuthClient) *Server {
	server := &Server{
		Config: conf,
		DB:     db,
	}

	// init authClient
	server.FireAuth = authClient

	// init services
	userService = *services.NewUserService(server.DB, server.FireAuth)
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

	// user routes
	{
		userRoutes := apiRoutes.Group("/users")
		userRoutes.Use(middlewares.AuthMiddleware(server.FireAuth))
		userRoutes.GET("/me", userController.GetUser)
		userRoutes.POST("/create", userController.CreateUser)
		userRoutes.PUT("/me", userController.UpdateUser)
		userRoutes.DELETE("/me", userController.DeleteUser)
	}

	// workout routes
	{
		workoutRoutes := apiRoutes.Group("/workouts")
		workoutRoutes.Use(middlewares.AuthMiddleware(server.FireAuth))
		workoutRoutes.POST("/create", workoutController.CreateWorkout)
		workoutRoutes.GET("/:user_id", workoutController.GetWorkouts)
		workoutRoutes.DELETE("/delete/:workout_id", workoutController.DeleteWorkout)
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

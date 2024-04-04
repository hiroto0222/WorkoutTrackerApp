package services

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/middlewares"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type UserService interface {
	CreateUser(ctx *gin.Context)
	GetUser(ctx *gin.Context)
}

type UserServiceImpl struct {
	db *gorm.DB
}

type CreateUserRequest struct {
	ID       string  `json:"id" binding:"required"`
	Name     string  `json:"name" binding:"required"`
	Email    string  `json:"email" binding:"required"`
	Role     string  `json:"role"`
	Photo    string  `json:"photo"`
	Verified bool    `json:"verified"`
	Provider string  `json:"provider" binding:"required"`
	Weight   float64 `json:"weight"`
	Height   float64 `json:"height"`
}

// CreateUser adds a new User record
func (s *UserServiceImpl) CreateUser(ctx *gin.Context) {
	var req CreateUserRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Println("binding json req failed")
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// check if authenticated user is the owner of the request
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id for request"})
		return
	}
	if userID != req.ID {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission"})
		return
	}

	// create user
	now := time.Now()
	user := models.User{
		ID:        req.ID,
		Name:      req.Name,
		Email:     req.Email,
		Role:      req.Role,
		Photo:     req.Photo,
		Verified:  req.Verified,
		Provider:  req.Provider,
		Weight:    req.Weight,
		Height:    req.Height,
		CreatedAt: now,
		UpdatedAt: now,
	}
	res := s.db.Create(&user)

	if res.Error != nil {
		// check if the user with the email already exists
		if strings.Contains(res.Error.Error(), "UNIQUE constraint failed: users.email") {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "User with that email already exists"})
			return
		}
		log.Printf("failed to create user: %v", res.Error)
		ctx.JSON(http.StatusBadRequest, gin.H{"message": res.Error.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, user)
}

// GetUser gets the user record for the requested user
func (s *UserServiceImpl) GetUser(ctx *gin.Context) {
	// check if authenticated user is the owner of the request
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id for request"})
		return
	}

	var user models.User
	res := s.db.First(&user, "id = ?", userID)
	if res.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user from database"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success", "data": user})
}

func NewUserService(db *gorm.DB) *UserServiceImpl {
	return &UserServiceImpl{
		db: db,
	}
}

package controllers

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/middlewares"
	"github.com/hiroto0222/workout-tracker-app/services"
)

type UserController interface {
	CreateUser(ctx *gin.Context)
	GetUser(ctx *gin.Context)
	UpdateUser(ctx *gin.Context)
	DeleteUser(ctx *gin.Context)
}

type UserControllerImpl struct {
	svc services.UserService
}

func NewUserController(userService *services.UserServiceImpl) *UserControllerImpl {
	return &UserControllerImpl{
		svc: userService,
	}
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
func (u *UserControllerImpl) CreateUser(ctx *gin.Context) {
	// create req struct from json
	var req CreateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// get userID from authentication middleware
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id for request"})
		return
	}

	// check if user is owner of request
	if userID != req.ID {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "You do not have permission"})
		return
	}

	// create user params
	params := &services.CreateUserParams{
		ID:       req.ID,
		Name:     req.Name,
		Email:    req.Email,
		Role:     req.Role,
		Photo:    req.Photo,
		Verified: req.Verified,
		Provider: req.Provider,
		Weight:   req.Weight,
		Height:   req.Height,
	}

	// create user
	user, err := u.svc.CreateUser(params)
	if err != nil {
		// check if the user with the email already exists
		if strings.Contains(err.Error(), "UNIQUE constraint failed: users.email") {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "User with that email already exists"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, user)
}

// GetUser gets the user record for the requested user
func (u *UserControllerImpl) GetUser(ctx *gin.Context) {
	// get userID from authentication middleware
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id for request"})
		return
	}

	// get user
	user, err := u.svc.GetUser(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve user from database"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success", "data": user})
}

type UpdateUserRequest struct {
	Name   string  `json:"name" binding:"required"`
	Weight float64 `json:"weight" binding:"required"`
	Height float64 `json:"height" binding:"required"`
}

// UpdateUser updates the user record of the requested user
func (u *UserControllerImpl) UpdateUser(ctx *gin.Context) {
	// create req struct from json
	var req UpdateUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Println("binding json req failed")
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	// get userID from authentication middleware
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id for request"})
		return
	}

	err := u.svc.UpdateUser(userID, req.Name, req.Weight, req.Height)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user from database"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success"})
}

// DeleteUser deletes the user
func (u *UserControllerImpl) DeleteUser(ctx *gin.Context) {
	// get userID from authentication middleware
	userID, ok := ctx.MustGet(middlewares.USER_ID).(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Failed to retrieve user id from request"})
		return
	}

	err := u.svc.DeleteUser(ctx, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Successfully deleted user data"})
}

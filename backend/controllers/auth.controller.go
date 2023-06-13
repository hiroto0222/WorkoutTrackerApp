package controllers

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/config"
	"github.com/hiroto0222/workout-tracker-app/models"
	"github.com/hiroto0222/workout-tracker-app/schemas"
	"github.com/hiroto0222/workout-tracker-app/utils"
	"gorm.io/gorm"
)

type AuthController struct {
	config config.Config
	db     *gorm.DB
}

func NewAuthController(config config.Config, db *gorm.DB) *AuthController {
	return &AuthController{config, db}
}

// SignUpUser create new user with name, email and password
func (ac *AuthController) SignUpUser(ctx *gin.Context) {
	var payload *schemas.RegisterUserInput

	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	now := time.Now()
	newUser := models.User{
		Name:      payload.Name,
		Email:     strings.ToLower(payload.Email),
		Password:  payload.Password,
		Role:      "user",
		Verified:  true,
		CreatedAt: now,
		UpdatedAt: now,
	}

	result := ac.db.Create(&newUser)

	if result.Error != nil && strings.Contains(result.Error.Error(), "UNIQUE constraint failed: users.email") {
		ctx.JSON(http.StatusConflict, gin.H{"status": "fail", "message": "User with that email already exists"})
		return
	} else if result.Error != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"status": "error", "message": "Something bad happened"})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"status": "success", "data": gin.H{"user": models.FilteredResponse(&newUser)}})
}

// SignInUser signs in user and a JWT token will be generated and included in the response as an HTTP-only cookie.
func (ac *AuthController) SignInUser(ctx *gin.Context) {
	var payload *schemas.LoginUserInput

	if err := ctx.ShouldBindJSON(&payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	var user models.User
	result := ac.db.First(&user, "email = ?", strings.ToLower(payload.Email))
	if result.Error != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": "Invalid email or Password"})
		return
	}

	if user.Provider == "Google" {
		ctx.JSON(http.StatusUnauthorized, gin.H{"status": "fail", "message": fmt.Sprintf("Use %v OAuth instead", user.Provider)})
		return
	}

	token, err := utils.GenerateToken(ac.config.TokenExpiresIn, user.ID, ac.config.JWTSecret)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"status": "fail", "message": err.Error()})
		return
	}

	ctx.SetCookie("token", token, ac.config.TokenMaxAge*60, "/", "localhost", false, true)

	ctx.JSON(http.StatusOK, gin.H{"status": "success"})
}

func (ac *AuthController) LogoutUser(ctx *gin.Context) {
	ctx.SetCookie("token", "", -1, "/", "localhost", false, true)
	ctx.JSON(http.StatusOK, gin.H{"status": "success"})
}

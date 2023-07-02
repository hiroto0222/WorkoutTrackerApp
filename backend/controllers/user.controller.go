package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type UserController struct {
	db *gorm.DB
}

func NewUserController(db *gorm.DB) *UserController {
	return &UserController{db}
}

func (uc *UserController) GetUser(ctx *gin.Context) {
	userId, ok := ctx.MustGet("USER_ID").(string)
	if !ok {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "failed to retrieve user id for request"})
	}

	var user models.User
	res := uc.db.First(&user, "id = ?", userId)
	if res.Error != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "failed to retrieve user from database"})
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": user})
}

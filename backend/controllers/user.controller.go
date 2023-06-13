package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/models"
)

func GetMe(ctx *gin.Context) {
	currentUser := ctx.MustGet("currentUser").(models.User)
	ctx.JSON(http.StatusOK, gin.H{"status": "success", "data": gin.H{"user": models.FilteredResponse(&currentUser)}})
}

package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetTodo(ctx *gin.Context) {
	currentUserID := ctx.MustGet("USER_ID").(string)
	ctx.JSON(http.StatusOK, gin.H{"status": "success", "user_id": currentUserID, "title": "todo 1"})
}

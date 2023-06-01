package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()
	server.GET("/api/v1/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "service is healthy",
		})
	})

	log.Fatal(server.Run(":8080"))
}

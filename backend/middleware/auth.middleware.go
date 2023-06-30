package middleware

import (
	"errors"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/models"
	services "github.com/hiroto0222/workout-tracker-app/services/auth"
	"gorm.io/gorm"
)

const (
	authorizationHeader = "Authorization"
)

func AuthMiddleware(authService *services.AuthService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		client := authService.FireAuth
		var token string
		cookie, err := ctx.Cookie("token")

		authorizationHeader := ctx.Request.Header.Get(authorizationHeader)
		fields := strings.Fields(authorizationHeader)

		if len(fields) != 0 && fields[0] == "Bearer" {
			token = fields[1]
		} else if err == nil {
			token = cookie
		}

		if token == "" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "You are not logged in",
			})
		}

		res, err := client.VerifyIDToken(ctx, token)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": err.Error(),
			})
		}

		var user models.User
		if err := authService.DB.Where("id = ?", res.UID).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// register new user who signed up through firebase in client
				registerUserPayload := services.RegisterUserPayload{}
				registerUserPayload.UID = res.UID
				registerUserPayload.SignInProvider = res.Firebase.SignInProvider
				if name, ok := res.Claims["name"]; ok {
					registerUserPayload.Name = name.(string)
				}
				if email, ok := res.Claims["email"]; ok {
					registerUserPayload.Email = email.(string)
				}
				authService.Register(registerUserPayload)
			} else {
				ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"message": err.Error(),
				})
			}
		}

		ctx.Set("USER_ID", res.UID)
		ctx.Next()
	}
}

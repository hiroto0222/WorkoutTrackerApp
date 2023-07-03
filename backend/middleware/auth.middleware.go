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

		if len(fields) >= 2 && fields[0] == "Bearer" {
			token = fields[1]
		} else if err == nil {
			token = cookie
		}

		if token == "" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "You are not logged in",
			})
			return
		}

		res, err := client.VerifyIDToken(ctx, token)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": err.Error(),
			})
			return
		}

		// register new user who signed up through firebase (if first time)
		var user models.User
		if err := authService.DB.Where("id = ?", res.UID).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				registerUserPayload := services.RegisterUserPayload{
					ID:             res.UID,
					SignInProvider: res.Firebase.SignInProvider,
				}
				if name, ok := res.Claims["name"]; ok {
					registerUserPayload.Name = name.(string)
				}
				if email, ok := res.Claims["email"]; ok {
					registerUserPayload.Email = email.(string)
				}
				if photo, ok := res.Claims["photoURL"]; ok {
					registerUserPayload.Photo = photo.(string)
				}
				authService.Register(registerUserPayload)
			} else {
				ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
					"message": err.Error(),
				})
				return
			}
		}

		ctx.Set("USER_ID", res.UID)
		ctx.Next()
	}
}

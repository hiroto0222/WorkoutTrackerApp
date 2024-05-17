package middlewares

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/config"
)

const (
	USER_ID             = "USER_ID"
	authorizationHeader = "Authorization"
)

func AuthMiddleware(client config.AuthClient) gin.HandlerFunc {
	return func(ctx *gin.Context) {
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

		// check access token with Firebase
		res, err := client.VerifyIDToken(ctx, token)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": err.Error(),
			})
			return
		}

		ctx.Set(USER_ID, res.UID)
		ctx.Next()
	}
}

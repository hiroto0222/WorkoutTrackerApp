package config

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

type Config struct {
	Origin string `mapstructure:"ORIGIN"`
	Port   string `mapstructure:"PORT"`

	// db config
	DBDriver string `mapstructure:"POSTGRES_DRIVER"`
	DBSource string `mapstructure:"POSTGRES_SOURCE"`

	// firebase config
	FirebaseServiceAcccountKey string `mapstructure:"FIREBASE_SERVICE_ACCOUNT_KEY"`

	// oauth config
	GoogleOAuthClientID     string `mapstructure:"GOOGLE_OAUTH_CLIENT_ID"`
	GoogleOAuthClientSecret string `mapstructure:"GOOGLE_OAUTH_CLIENT_SECRET"`
	GoogleOAuthRedirectURL  string `mapstructure:"GOOGLE_OAUTH_REDIRECT_URL"`
}

func LoadConfig(path string) (config Config, err error) {
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "release" {
		gin.SetMode(gin.ReleaseMode)
		config.Origin = os.Getenv("ORIGIN")
		config.Port = os.Getenv("PORT")
		config.DBDriver = os.Getenv("POSTGRES_DRIVER")
		config.DBSource = os.Getenv("POSTGRES_SOURCE")
		config.FirebaseServiceAcccountKey = os.Getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
		config.GoogleOAuthClientID = os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
		config.GoogleOAuthClientSecret = os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET")
		config.GoogleOAuthRedirectURL = os.Getenv("GOOGLE_OAUTH_REDIRECT_URL")
		return
	}

	viper.AddConfigPath(path)
	viper.SetConfigType("env")
	viper.SetConfigName("app")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}

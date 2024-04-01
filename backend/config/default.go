package config

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

type Config struct {
	// server config
	Origin string `mapstructure:"ORIGIN"`
	Port   string `mapstructure:"PORT"`

	// db config
	DBSource string `mapstructure:"POSTGRES_SOURCE"`

	// firebase config
	FirebaseServiceAcccountKey string `mapstructure:"FIREBASE_SERVICE_ACCOUNT_KEY"`

	// oauth config
	GoogleOAuthClientID     string `mapstructure:"GOOGLE_OAUTH_CLIENT_ID"`
	GoogleOAuthClientSecret string `mapstructure:"GOOGLE_OAUTH_CLIENT_SECRET"`
}

func LoadConfig(path string) (config Config, err error) {
	fmt.Println("TEST FLY CI!")
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "release" {
		gin.SetMode(gin.ReleaseMode)
		config.Origin = "*"
		config.Port = os.Getenv("PORT")
		config.DBSource = os.Getenv("DATABASE_URL")
		config.FirebaseServiceAcccountKey = os.Getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
		config.GoogleOAuthClientID = os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
		config.GoogleOAuthClientSecret = os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET")
		log.Printf("Origin: %v", config.Origin)
		log.Printf("Port: %v", config.Port)
		log.Printf("DBSource: %v", config.DBSource)
		log.Printf("FirebaseServiceAccountKey: %v", config.FirebaseServiceAcccountKey)
		log.Printf("GoogleOAuthClientID: %v", config.GoogleOAuthClientID)
		log.Printf("GoogleOAuthClientSecret: %v", config.GoogleOAuthClientSecret)
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

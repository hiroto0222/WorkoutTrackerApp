package config

import (
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
}

func LoadConfig(path string) (config Config, err error) {
	ginMode := os.Getenv("GIN_MODE")
	if ginMode == "release" {
		gin.SetMode(gin.ReleaseMode)
		config.Origin = "*"
		config.Port = os.Getenv("PORT")
		config.DBSource = os.Getenv("DATABASE_URL")
		config.FirebaseServiceAcccountKey = os.Getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
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

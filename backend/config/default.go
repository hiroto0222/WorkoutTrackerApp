package config

import (
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	Origin string `mapstructure:"ORIGIN"`

	// jwt config
	JWTSecret      string        `mapstructure:"JWT_SECRET"`
	TokenExpiresIn time.Duration `mapstructure:"TOKEN_EXPIRES_IN"`
	TokenMaxAge    int           `mapstructure:"TOKEN_MAX_AGE"`

	// db config
	DBDriver string `mapstructure:"POSTGRES_DRIVER"`
	DBSource string `mapstructure:"POSTGRES_SOURCE"`

	// oauth config
	GoogleOAuthClientID     string `mapstructure:"GOOGLE_OAUTH_CLIENT_ID"`
	GoogleOAuthClientSecret string `mapstructure:"GOOGLE_OAUTH_CLIENT_SECRET"`
	GoogleOAuthRedirectURL  string `mapstructure:"GOOGLE_OAUTH_REDIRECT_URL"`
}

func LoadConfig(path string) (config Config, err error) {
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

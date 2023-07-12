package config

import (
	"context"
	"log"

	b64 "encoding/base64"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)

func InitAuth(config Config) (*auth.Client, error) {
	// decode base64 json
	bytes, err := b64.StdEncoding.DecodeString(config.FirebaseServiceAcccountKey)
	if err != nil {
		log.Fatalf("Failed to decode base64 json Firebase service-account-key: %v", err)
	}

	// create a Firebase app instance
	opt := option.WithCredentialsJSON(bytes)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("Failed to create Firebase app: %v", err)
	}

	// Create a Firebase auth client instance
	authClient, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("Failed to create Firebase auth client: %v", err)
	}

	return authClient, nil
}

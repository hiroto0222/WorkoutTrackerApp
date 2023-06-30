package config

import (
	"context"
	"log"
	"os"
	"path/filepath"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)

func InitAuth() (*auth.Client, error) {
	// get the current working directory
	dir, err := os.Getwd()
	if err != nil {
		log.Fatalf("failed to get current working directory: %v", err)
	}

	// construct the file path to the service account key file
	keyFilePath := filepath.Join(dir, "/config/service-account-key.json")

	// create a Firebase app instance
	opt := option.WithCredentialsFile(keyFilePath)
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

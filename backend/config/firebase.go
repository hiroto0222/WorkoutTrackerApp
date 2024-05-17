package config

import (
	"context"
	"log"

	b64 "encoding/base64"
	"encoding/json"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"google.golang.org/api/option"
)

// interface for Firebase Authclient
type FirebaseAuthClient struct {
	authClient *auth.Client
}

// DeleteUser deletes the user by the given UID.
func (c *FirebaseAuthClient) DeleteUser(ctx context.Context, uid string) error {
	return c.authClient.DeleteUser(ctx, uid)
}

// VerifyIDToken verifies the signature and payload of the provided ID token.
func (c *FirebaseAuthClient) VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
	return c.authClient.VerifyIDToken(ctx, idToken)
}

// Abstract interface for Firebase Authclient for server
type AuthClient interface {
	// DeleteUser deletes the user by the given UID.
	DeleteUser(ctx context.Context, uid string) error
	// VerifyIDToken verifies the signature and payload of the provided ID token.
	VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error)
}

type serviceAccountKey struct {
	ProjectID string `json:"project_id"`
}

func InitAuth(config Config) (*FirebaseAuthClient, error) {
	// decode base64 json
	bytes, err := b64.StdEncoding.DecodeString(config.FirebaseServiceAcccountKey)
	if err != nil {
		log.Fatalf("Failed to decode base64 json Firebase service-account-key: %v", err)
	}

	// parse to json
	var serviceAccountKey serviceAccountKey
	err = json.Unmarshal(bytes, &serviceAccountKey)
	if err != nil {
		log.Fatalf("Failed to parse service account key JSON: %v", err)
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

	log.Println("Successfully initialized firebase auth client:", serviceAccountKey.ProjectID)

	return &FirebaseAuthClient{authClient: authClient}, nil
}

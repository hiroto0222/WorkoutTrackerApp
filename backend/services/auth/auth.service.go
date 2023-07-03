package services

import (
	"context"
	"errors"
	"log"
	"strings"
	"time"

	"firebase.google.com/go/auth"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type AuthService struct {
	DB       *gorm.DB
	FireAuth *auth.Client
}

type LoginUserPayload struct {
	UID   string
	Name  string
	Email string
}

// Login authenticates a user with the provided credentials and returns a Firebase custom token
func (s *AuthService) Login(payload LoginUserPayload) (string, error) {
	// get user from database
	var user models.User
	res := s.DB.First(&user, "email = ?", strings.ToLower(payload.Email))
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return "", errors.New("user with email does not exist")
		}
		log.Printf("failed to get user by email from database: %v", res.Error)
		return "", errors.New("internal server error")
	}

	// generate a Firebase custom token for the user
	token, err := s.FireAuth.CustomToken(context.Background(), user.ID)
	if err != nil {
		log.Printf("failed to generate custom token: %v", err)
		return "", errors.New("internal server error")
	}

	return token, nil
}

type RegisterUserPayload struct {
	ID             string
	Name           string
	Email          string
	Role           string
	Photo          string
	Verified       bool
	SignInProvider string
}

// Register creates a new user in the database with the provided credentials
func (s *AuthService) Register(payload RegisterUserPayload) error {
	// create new user
	now := time.Now()
	user := models.User{
		ID:        payload.ID,
		Name:      payload.Name,
		Email:     strings.ToLower(payload.Email),
		Role:      "user",
		Verified:  true,
		Provider:  payload.SignInProvider,
		CreatedAt: now,
		UpdatedAt: now,
	}
	res := s.DB.Create(&user)

	// check if the user with the email already exists
	if res.Error != nil {
		if strings.Contains(res.Error.Error(), "UNIQUE constraint failed: users.email") {
			return errors.New("user with that email already exists")
		}
		log.Printf("failed to create user: %v", res.Error)
		return errors.New("internal server error")
	}

	return nil
}

package services

import (
	"context"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/models"
	"gorm.io/gorm"
)

type UserService interface {
	CreateUser(createUserParams *CreateUserParams) (*models.User, error)
	GetUser(userID string) (*models.User, error)
	UpdateUser(userID, name string, weight, height float64) error
	DeleteUser(ctx *gin.Context, userID string) error
}

// declare AuthClient interface to abstract firebase SDK
type AuthClient interface {
	DeleteUser(context.Context, string) error
}

type UserServiceImpl struct {
	db       *gorm.DB
	fireAuth AuthClient
}

func NewUserService(db *gorm.DB, fireAuth AuthClient) *UserServiceImpl {
	return &UserServiceImpl{
		db:       db,
		fireAuth: fireAuth,
	}
}

// CreateUser adds a new User record to DB
func (s *UserServiceImpl) CreateUser(createUserParams *CreateUserParams) (*models.User, error) {
	now := time.Now()
	user := models.User{
		ID:        createUserParams.ID,
		Name:      createUserParams.Name,
		Email:     createUserParams.Email,
		Role:      createUserParams.Role,
		Photo:     createUserParams.Photo,
		Verified:  createUserParams.Verified,
		Provider:  createUserParams.Provider,
		Weight:    createUserParams.Weight,
		Height:    createUserParams.Height,
		CreatedAt: now,
		UpdatedAt: now,
	}
	res := s.db.Create(&user)

	if res.Error != nil {
		return nil, res.Error
	}

	return &user, nil
}

// GetUser gets the user from DB
func (s *UserServiceImpl) GetUser(userID string) (*models.User, error) {
	var user models.User
	res := s.db.First(&user, "id = ?", userID)
	if res.Error != nil {
		return nil, res.Error
	}

	return &user, nil
}

// UpdateUser updates the provided user in DB
func (s *UserServiceImpl) UpdateUser(userID, name string, weight, height float64) error {
	// get user
	var user models.User
	res := s.db.First(&user, "id = ?", userID)
	if res.Error != nil {
		return res.Error
	}

	// update user
	user.Name = name
	user.Weight = weight
	user.Height = height
	res = s.db.Save(&user)
	if res.Error != nil {
		return res.Error
	}

	return nil
}

// DeleteUser deletes firebase auth account and all user associated data from db
func (s *UserServiceImpl) DeleteUser(ctx *gin.Context, userID string) error {
	// get user from database
	var user models.User
	res := s.db.First(&user, "id = ?", userID)
	if res.Error != nil {
		return res.Error
	}

	// delete account from firebase
	err := s.fireAuth.DeleteUser(ctx, userID)
	if err != nil {
		return err
	}

	// delete user from database
	res = s.db.Delete(&user)
	if res.Error != nil {
		return res.Error
	}

	return nil
}

type CreateUserParams struct {
	ID       string
	Name     string
	Email    string
	Role     string
	Photo    string
	Verified bool
	Provider string
	Weight   float64
	Height   float64
}

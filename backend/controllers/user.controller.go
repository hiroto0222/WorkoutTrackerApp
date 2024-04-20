package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/hiroto0222/workout-tracker-app/services"
)

type UserController interface {
	CreateUser(ctx *gin.Context)
	GetUser(ctx *gin.Context)
	UpdateUser(ctx *gin.Context)
}

type UserControllerImpl struct {
	svc services.UserService
}

func (u *UserControllerImpl) CreateUser(ctx *gin.Context) {
	u.svc.CreateUser(ctx)
}

func (u *UserControllerImpl) GetUser(ctx *gin.Context) {
	u.svc.GetUser(ctx)
}

func (u *UserControllerImpl) UpdateUser(ctx *gin.Context) {
	u.svc.UpdateUser(ctx)
}

func NewUserController(userService *services.UserServiceImpl) *UserControllerImpl {
	return &UserControllerImpl{
		svc: userService,
	}
}

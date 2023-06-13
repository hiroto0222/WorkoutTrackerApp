package schemas

type RegisterUserInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" bindinig:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginUserInput struct {
	Email    string `json:"email" bindinig:"required"`
	Password string `json:"password" binding:"required"`
}

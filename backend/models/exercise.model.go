package models

type Exercise struct {
	ID      int    `json:"id" gorm:"type:int;primary_key"`
	Name    string `json:"name" gorm:"type:varchar(255);uniqueIndex;not null"`
	LogType string `json:"log_type" gorm:"type:varchar(255);not null"`
}

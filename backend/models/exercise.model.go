package models

import "github.com/lib/pq"

type Exercise struct {
	ID               int            `json:"id" gorm:"type:int;primary_key"`
	Name             string         `json:"name" gorm:"type:varchar(255);uniqueIndex;not null"`
	Equipment        string         `json:"equipment" gorm:"type:varchar(255)"`
	PrimaryMuscles   pq.StringArray `json:"primary_muscles" gorm:"type:text[]"`
	SecondaryMuscles pq.StringArray `json:"secondary_muscles" gorm:"type:text[]"`
	Instructions     pq.StringArray `json:"instructions" gorm:"type:text[]"`
	Category         string         `json:"category"`
}

package main

import (
	"log"

	"github.com/hiroto0222/workout-tracker-app/config"
	"github.com/hiroto0222/workout-tracker-app/db"
	"github.com/hiroto0222/workout-tracker-app/server"
)

func main() {
	// load config
	config, err := config.LoadConfig(".")
	if err != nil {
		log.Fatalf("could not load config, %v", err)
	}

	// connect to db
	db := db.Init(config)

	// create server
	server := server.NewServer(config, db)

	log.Fatal(server.Start())
}

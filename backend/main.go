package main

import (
	"log"

	"github.com/hiroto0222/workout-tracker-app/config"
	"github.com/hiroto0222/workout-tracker-app/db"
	"github.com/hiroto0222/workout-tracker-app/server"
)

func main() {
	// load config
	conf, err := config.LoadConfig(".")
	if err != nil {
		log.Fatalf("could not load config, %v", err)
	}

	// connect to db
	db := db.Init(conf)

	// init Firebase auth client
	authClient, err := config.InitAuth(conf)
	if err != nil {
		log.Fatal("failed to create firebase auth instance")
	}

	// create server
	server := server.NewServer(conf, db, authClient)

	// start server
	log.Fatal(server.Start())
}

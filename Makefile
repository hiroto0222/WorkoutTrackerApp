local-db:
	docker exec -it workout-tracker-app-postgres psql -U postgres -d workout_tracker_app_db

build-production:
	docker-compose -f production.yml up --build

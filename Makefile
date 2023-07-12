local-db:
	docker exec -it workout-tracker-app-postgres psql -U postgres -d workout_tracker_app_db

build-production:
	docker-compose -f production.yml up --build

encode-service-account-key-to-base64:
	base64 -i ./backend/config/service-account-key.json

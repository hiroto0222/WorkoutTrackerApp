connect-local-db:
	docker exec -it workout-tracker-app-postgres psql -U postgres -d workout_tracker_app_db

connect-prod-db:
	fly postgres connect -a workouttrackerapp-db --database workout_tracker_app

encode-service-account-key-to-base64:
	base64 -i ./backend/config/service-account-key.json

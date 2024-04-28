connect-local-db:
	docker exec -it workout-tracker-app-postgres psql -U postgres -d workout_tracker_app_db

connect-prod-db:
	fly postgres connect -a workouttrackerapp-db --database workout_tracker_app

forward-prod-db-port:
	fly proxy 6543:5432 -a workouttrackerapp-db

encode-service-account-key-to-base64:
	base64 -i ./backend/config/service-account-key.json

tests:
	docker-compose exec backend go test -v -coverpkg ./... ./... -coverprofile=cover.out

see-coverage:
	cd backend && go tool cover -html=cover.out -o cover.html && open cover.html

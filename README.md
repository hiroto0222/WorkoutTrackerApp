# WorkoutTrackerApp

### Tech Stack
Backend:
- Golang, Gin
- Postgresql, Gorm
- Firebase authentication

Client:
- TypeScript, React Native + Expo
- Redux

### Local Development
Backend:
```
docker-compose build
docker-compose up
```
Client (Android):
```
yarn android
```
- in case of crashes, run from ./android:
```
./gradlew clean
```

### Production
Client (Android):
```
eas build --platform android
```
- for more info: https://docs.expo.dev/build/setup/#an-expo-user-account

### ER Diagram
![WorkoutTrackerApp](https://github.com/hiroto0222/WorkoutTrackerApp/assets/45121253/fa2be41d-4073-45b9-9018-bc80715c0d2e)

### Backend Deployment Diagram
![workout-tracker-gcp drawio (1)](https://github.com/hiroto0222/WorkoutTrackerApp/assets/45121253/ed20fcd9-dbf5-4ded-9cbb-f9cf0eb2cd16)

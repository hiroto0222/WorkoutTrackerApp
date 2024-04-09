<p align="center">
  <img src="./images/preview.png" alt="app-preview" width="90%">
  <div align="center">A Mobile app companion for your workouts. Built with React Native, Expo</div>
</p>

---

<!-- <p align="center">
  <a href="">
    <img alt="Get it on Google Play" title="Google Play" src="./images/google-play-badge.png" width="140">
  </a>
</p> -->

- **React Native version**: 0.71
- **Supported iOS versions**: 13.0+
- **Supported Android versions**: 5.0+

## Demo

## Features
- Keep records of exercises, number of sets, weights, reps, etc. in each workout performed.
- See progress of your workouts and habits at a glance.
- Login/Signup using email or Google.

## Built with
Client:
- TypeScript, React Native, Expo
- Firebase Authentication
- Redux

Backend:
- Golang, Gin
- Postgresql, Gorm
- Firebase Authentication, Google OAuth

Deployment:
- Client App -> Expo Application Services
- Web App, Database -> Fly.io

<p align="center">
  <img src="./images/deloyment.png" alt="deployment" width="50%">
</p>

## ER Diagram
![WorkoutTrackerApp](https://github.com/hiroto0222/WorkoutTrackerApp/assets/45121253/fa2be41d-4073-45b9-9018-bc80715c0d2e)

## Local
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

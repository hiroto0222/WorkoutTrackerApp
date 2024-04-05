import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, compose, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import authReducer from "./slices/auth";
import exercisesReducer from "./slices/exercises";
import userReducer from "./slices/user";
import workoutReducer from "./slices/workout";
import workoutDataReducer from "./slices/workoutData";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["workoutData", "exercises"], // only persist workoutData and exercises
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  workout: workoutReducer,
  workoutData: workoutDataReducer,
  exercises: exercisesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  enhancers: composeEnhancers,
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

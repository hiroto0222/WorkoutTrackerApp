import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ICreateWorkoutResponse,
  IWorkoutLogsResponse,
  IWorkoutsResponse,
} from "api/types";
import { binarySearch } from "utils";

export interface WorkoutDataState {
  workouts: IWorkoutsResponse[];
  workoutLogs: IWorkoutLogsResponse;
}

const initialState: WorkoutDataState = {
  workouts: [],
  workoutLogs: {},
};

export const workoutDataSlice = createSlice({
  name: "workoutData",
  initialState,
  reducers: {
    /**
     * setWorkouts rewrites all workout data stored in client
     */
    setWorkouts: (
      state,
      action: PayloadAction<{
        workouts: IWorkoutsResponse[];
        workoutLogs: IWorkoutLogsResponse;
      }>
    ) => {
      state.workouts = action.payload.workouts;
      state.workoutLogs = action.payload.workoutLogs;
    },
    /**
     * addFinishedWorkout inserts a created workout into presorted workouts array
     */
    addFinishedWorkout: (
      state,
      action: PayloadAction<ICreateWorkoutResponse>
    ) => {
      // add new workout to exisitng sorted workouts (descending) using binary search
      const newWorkout = action.payload.workout;
      const idx = binarySearch(state.workouts, newWorkout);
      state.workouts = [
        ...state.workouts.slice(0, idx),
        newWorkout,
        ...state.workouts.slice(idx),
      ];
      state.workoutLogs[action.payload.workout.id] = action.payload.logs;
    },
    /**
     * removeWorkout deletes a workout from client
     */
    removeWorkout: (state, action: PayloadAction<string>) => {
      const workoutId = action.payload;
      state.workouts = state.workouts.filter(
        (workout) => workout.id !== workoutId
      );
      delete state.workoutLogs[workoutId];
    },
  },
});

export const { setWorkouts, addFinishedWorkout, removeWorkout } =
  workoutDataSlice.actions;

export default workoutDataSlice.reducer;

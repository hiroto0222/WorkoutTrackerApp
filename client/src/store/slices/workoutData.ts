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
  },
});

export const { setWorkouts, addFinishedWorkout } = workoutDataSlice.actions;

export default workoutDataSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ICreateWorkoutResponse,
  IWorkoutLogsResponse,
  IWorkoutsResponse,
} from "api/types";

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
      state.workouts = [action.payload.workout, ...state.workouts];
      state.workoutLogs[action.payload.workout.id] = action.payload.logs;
    },
  },
});

export const { setWorkouts, addFinishedWorkout } = workoutDataSlice.actions;

export default workoutDataSlice.reducer;

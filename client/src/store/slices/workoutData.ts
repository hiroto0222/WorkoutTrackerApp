import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IWorkoutLogsResponse, IWorkoutsResponse } from "api/types";

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
  },
});

export const { setWorkouts } = workoutDataSlice.actions;

export default workoutDataSlice.reducer;

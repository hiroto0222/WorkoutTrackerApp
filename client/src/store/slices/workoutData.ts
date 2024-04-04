import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IWorkoutsResponse } from "api/types";

export interface WorkoutDataState {
  workouts: IWorkoutsResponse[];
}

const initialState: WorkoutDataState = {
  workouts: [],
};

export const workoutDataSlice = createSlice({
  name: "workoutData",
  initialState,
  reducers: {
    setWorkouts: (state, action: PayloadAction<IWorkoutsResponse[]>) => {
      state.workouts = action.payload;
    },
  },
});

export const { setWorkouts } = workoutDataSlice.actions;

export default workoutDataSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface WorkoutState {
  startedAt?: Date;
  endedAt?: Date;
  exerciseLogs: string[];
}

const initialState: WorkoutState = {
  startedAt: undefined,
  endedAt: undefined,
  exerciseLogs: [],
};

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setStartWorkingOut: (state, action: PayloadAction<void>) => {
      state.startedAt = new Date();
    },
  },
});

export const { setStartWorkingOut } = workoutSlice.actions;

export default workoutSlice.reducer;

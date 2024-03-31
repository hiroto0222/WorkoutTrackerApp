import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface WorkoutState {
  startedAt?: string;
  endedAt?: string;
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
      const date = new Date();
      state.startedAt = date.toString();
    },
  },
});

export const { setStartWorkingOut } = workoutSlice.actions;

export default workoutSlice.reducer;

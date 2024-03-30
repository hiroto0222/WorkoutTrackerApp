import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface WorkoutState {
  isWorkingOut?: boolean;
  id?: string;
  logs?: string[];
}

const initialState: WorkoutState = {
  isWorkingOut: false,
  id: undefined,
  logs: [],
};

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setIsWorkingOut: (state, action: PayloadAction<boolean>) => {
      state.isWorkingOut = action.payload;
    },
    addLog: (state, action: PayloadAction<string>) => {
      state.logs?.push(action.payload);
    },
  },
});

export const { setIsWorkingOut, addLog } = workoutSlice.actions;

export default workoutSlice.reducer;

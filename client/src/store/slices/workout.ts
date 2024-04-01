import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IExercise, ILog } from "api";

export interface WorkoutState {
  startedAt?: string;
  endedAt?: string;
  currExercises: IExercise[];
  currLogs: { [exercise_id: number]: ILog[] };
}

const initialState: WorkoutState = {
  startedAt: undefined,
  endedAt: undefined,
  currExercises: [],
  currLogs: {},
};

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setStartWorkingOut: (state, action: PayloadAction<void>) => {
      const date = new Date();
      state.startedAt = date.toString();
      state.currExercises = [];
      state.currLogs = {};
    },
    addCurrExercises: (state, action: PayloadAction<IExercise[]>) => {
      state.currExercises = state.currExercises.concat(action.payload);
    },
    removeCurrExercises: (state, action: PayloadAction<number>) => {
      state.currExercises = state.currExercises.filter(
        (exercise) => exercise.id != action.payload
      );
    },
  },
});

export const { setStartWorkingOut, addCurrExercises, removeCurrExercises } =
  workoutSlice.actions;

export default workoutSlice.reducer;

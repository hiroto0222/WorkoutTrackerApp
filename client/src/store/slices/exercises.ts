import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IExerciseResponse } from "api/types";

export interface ExercisesState {
  exercises: { [exercise_id: number]: IExerciseResponse };
}

const initialState: ExercisesState = {
  exercises: {},
};

export const exercisesSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {
    setExercises: (state, action: PayloadAction<IExerciseResponse[]>) => {
      action.payload.forEach((exercise) => {
        state.exercises[exercise.id] = exercise;
      });
    },
  },
});

export const { setExercises } = exercisesSlice.actions;

export default exercisesSlice.reducer;

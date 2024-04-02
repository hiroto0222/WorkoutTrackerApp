import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IExercise } from "api/types";

export type Log = {
  weight?: number;
  reps?: number;
  time?: number;
  isCompleted: boolean;
};

export interface WorkoutState {
  startedAt: string;
  endedAt?: string;
  currExercises: IExercise[];
  currLogs: { [exercise_id: number]: Log[] };
}

const initialState: WorkoutState = {
  startedAt: Date.now().toString(),
  endedAt: undefined,
  currExercises: [],
  currLogs: {},
};

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setStartWorkingOut: (state, action: PayloadAction<void>) => {
      const date = new Date().toJSON();
      state.startedAt = date;
      state.currExercises = [];
      state.currLogs = {};
    },
    addCurrExercises: (state, action: PayloadAction<IExercise[]>) => {
      // add selected exercises
      state.currExercises = state.currExercises.concat(action.payload);
      // initially populate exercise logs
      action.payload.forEach((exercise) => {
        const log: Log = {
          weight: undefined,
          reps: undefined,
          time: undefined,
          isCompleted: false,
        };
        state.currLogs[exercise.id] = [log];
      });
    },
    removeCurrExercises: (state, action: PayloadAction<number>) => {
      state.currExercises = state.currExercises.filter(
        (exercise) => exercise.id != action.payload
      );
    },
    addEmptyLog: (state, action: PayloadAction<IExercise>) => {
      const emptyLog: Log = {
        weight: undefined,
        reps: undefined,
        time: undefined,
        isCompleted: false,
      };
      state.currLogs[action.payload.id] = [
        ...state.currLogs[action.payload.id],
        emptyLog,
      ];
    },
    addCompletedLog: (
      state,
      action: PayloadAction<{
        exercise: IExercise;
        newLog: Log;
        setNumber: number;
      }>
    ) => {
      const exerciseId = action.payload.exercise.id;
      const newLog = action.payload.newLog;
      const setNumber = action.payload.setNumber;
      state.currLogs[exerciseId] = state.currLogs[exerciseId].map((log, i) =>
        i === setNumber ? newLog : log
      );
    },
    setFinishWorkout: (state, action: PayloadAction) => {
      state.currExercises = [];
      state.currLogs = {};
    },
  },
});

export const {
  setStartWorkingOut,
  addCurrExercises,
  removeCurrExercises,
  addEmptyLog,
  addCompletedLog,
  setFinishWorkout,
} = workoutSlice.actions;

export default workoutSlice.reducer;

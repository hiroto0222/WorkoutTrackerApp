import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IExercise } from "api/types";

export type Log = {
  weight?: number;
  reps?: number;
  time?: number;
  isCompleted: boolean;
};

export interface WorkoutState {
  isFinished: boolean;
  startedAt: string;
  endedAt?: string;
  currExercises: IExercise[];
  currLogs: { [exercise_id: number]: Log[] };
}

const initialState: WorkoutState = {
  isFinished: false,
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
      state.isFinished = false;
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
    setInCompleteLog: (
      state,
      action: PayloadAction<{
        exercise: IExercise;
        setNumber: number;
      }>
    ) => {
      const exerciseId = action.payload.exercise.id;
      const setNumber = action.payload.setNumber;
      state.currLogs[exerciseId] = state.currLogs[exerciseId].map((log, i) => {
        if (i === setNumber) {
          log.isCompleted = false;
          return log;
        }
        return log;
      });
    },
    deleteLog: (
      state,
      action: PayloadAction<{
        exercise: IExercise;
        setNumber: number;
      }>
    ) => {
      const exerciseId = action.payload.exercise.id;
      const setNumber = action.payload.setNumber;
      state.currLogs[exerciseId] = state.currLogs[exerciseId].filter(
        (log, i) => {
          if (i !== setNumber) {
            return log;
          }
        }
      );

      // if last log was deleted, also delete the exercise
      if (state.currLogs[exerciseId].length < 1) {
        state.currExercises = state.currExercises.filter(
          (exercise) => exercise.id != exerciseId
        );
      }
    },
    setFinishWorkout: (state, action: PayloadAction) => {
      state.isFinished = true;
    },
  },
});

export const {
  setStartWorkingOut,
  addCurrExercises,
  removeCurrExercises,
  addEmptyLog,
  addCompletedLog,
  setInCompleteLog,
  setFinishWorkout,
  deleteLog,
} = workoutSlice.actions;

export default workoutSlice.reducer;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IExerciseResponse } from "api/types";

export type Log = {
  weight?: number;
  reps?: number;
  time?: number;
  isCompleted: boolean;
};

export interface WorkoutState {
  isFinished: boolean;
  isActive: boolean;
  startedAt: string;
  endedAt?: string;
  currExercises: IExerciseResponse[];
  currLogs: { [exercise_id: number]: Log[] };
  userStartDate?: string;
  userStartTime?: string;
  userEndTime?: string;
}

const initialState: WorkoutState = {
  isFinished: false,
  isActive: false,
  startedAt: "not yet",
  endedAt: undefined,
  currExercises: [],
  currLogs: {},
};

export const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setStartWorkingOut: (state, action: PayloadAction<void>) => {
      const startDate = new Date();
      const userStartTime = new Date();
      const userEndTime = new Date();
      userEndTime.setHours(userStartTime.getHours() + 1);
      state.startedAt = startDate.toJSON();
      state.isActive = true;
      state.isFinished = false;
      state.currExercises = [];
      state.currLogs = {};
      state.userStartDate = startDate.toJSON();
      state.userStartTime = userStartTime.toJSON();
      state.userEndTime = userEndTime.toJSON();
    },
    setUserStartDate: (state, action: PayloadAction<string>) => {
      state.userStartDate = action.payload;
    },
    setUserStartTime: (state, action: PayloadAction<string>) => {
      state.userStartTime = action.payload;
    },
    setUserEndTime: (state, action: PayloadAction<string>) => {
      state.userEndTime = action.payload;
    },
    addCurrExercises: (state, action: PayloadAction<IExerciseResponse[]>) => {
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
    addEmptyLog: (state, action: PayloadAction<IExerciseResponse>) => {
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
        exercise: IExerciseResponse;
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
        exercise: IExerciseResponse;
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
        exercise: IExerciseResponse;
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
      state.isActive = false;
      state.isFinished = true;
      state.currExercises = [];
      state.currLogs = {};
      state.endedAt = undefined;
    },
  },
});

export const {
  setStartWorkingOut,
  setUserStartDate,
  setUserStartTime,
  setUserEndTime,
  addCurrExercises,
  removeCurrExercises,
  addEmptyLog,
  addCompletedLog,
  setInCompleteLog,
  setFinishWorkout,
  deleteLog,
} = workoutSlice.actions;

export default workoutSlice.reducer;

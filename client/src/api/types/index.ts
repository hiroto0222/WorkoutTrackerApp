// User data recieved
export interface IUser {
  id: string;
  name: string;
  email?: string;
  role: string;
  photo: string;
  verified: boolean;
  provider: string;
  weight?: number;
  height?: number;
  created_at: string;
  updated_at: string;
}

// User data to send to create a user
export interface ICreateUserRequest {
  id: string;
  name: string;
  email?: string;
  role: string;
  photo: string;
  verified: boolean;
  provider: string;
  weight?: number;
  height?: number;
}

// Exercise log types
export type LogType = "weight_reps" | "reps" | "timer" | "cardio";

// Exercise data recieved
export interface IExerciseResponse {
  id: number;
  name: string;
  log_type: LogType;
}

// Log data to send
export interface ILog {
  weight?: number;
  reps?: number;
  time?: number;
}

// List of log data to send as POST request
export interface ILogs {
  [exercise_id: number]: ILog[];
}

// Workout data to send as POST request
export interface ICreateWorkoutRequest {
  user_id: string;
  started_at: string;
  ended_at: string;
  exercise_ids: number[];
  logs: ILogs;
}

// WorkoutData.workouts sent from server
export interface IWorkoutsResponse {
  id: string;
  started_at: string;
  ended_at: string;
}

// Log data sent from server
export interface ILogResponse {
  exercise_id: number;
  weight?: number;
  reps?: number;
  time?: number;
}

// WorkoutData.workoutLogs sent from server
export interface IWorkoutLogsResponse {
  [workout_id: string]: ILogResponse[];
}

// WorkoutData sent from server
export interface IWorkoutDataResponse {
  workouts: IWorkoutsResponse[];
  workout_logs: IWorkoutLogsResponse;
}

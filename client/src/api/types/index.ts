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
export interface IExercise {
  id: number;
  name: string;
  log_type: LogType;
}

// Log data to send as POST request
export interface ILogRequest {
  weight?: number;
  reps?: number;
  time?: number;
}

// List of log data to send as POST request
export interface ILogRequests {
  [exercise_id: number]: ILogRequest[];
}

// Workout data to send as POST request
export interface ICreateWorkoutRequest {
  user_id: string;
  started_at: string;
  ended_at: string;
  exercise_ids: number[];
  logs: ILogRequests;
}

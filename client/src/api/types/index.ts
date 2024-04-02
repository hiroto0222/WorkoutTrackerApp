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

// TODO: Log data to send/recieve
export interface ILog {
  id?: number;
  workout_id?: number;
  workout_exercise_id?: number;
  set_number: number;
  weight: number;
  reps: number;
  createdAt: string;
  updatedAt: string;
}

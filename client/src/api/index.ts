import { SERVER_ENDPOINT } from "@env";
import axios, { AxiosRequestConfig, AxiosResponseHeaders } from "axios";

const instance = axios.create({
  baseURL: SERVER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log(SERVER_ENDPOINT);

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

export interface IExercise {
  id: number;
  name: string;
  equipment: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  instructions: string[];
  category: string;
}

export interface AxiosResponse<T = any, D = any> {
  data: {
    message: string;
    data: T;
  };
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
}

export default instance;

import { SERVER_ENDPOINT } from "@env";
import axios, { AxiosRequestConfig, AxiosResponseHeaders } from "axios";

export const API_ENDPOINTS = {
  USERS: {
    GET: "users/me",
    CREATE: "users/create",
    PUT: "users/me",
    DELETE: "users/me",
  },
  EXERCISES: {
    GET: "exercises",
  },
  WORKOUTS: {
    GET: "workouts/",
    CREATE: "workouts/create",
    DELETE: "workouts/delete/",
  },
};

const instance = axios.create({
  baseURL: SERVER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("api endpoint is: ", SERVER_ENDPOINT);
console.log("api endpoint is: ", SERVER_ENDPOINT);
console.log("api endpoint is::: ", SERVER_ENDPOINT);
console.log("api endpoint is: ", SERVER_ENDPOINT);
console.log("api endpoint is: ", SERVER_ENDPOINT);

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

import { SERVER_ENDPOINT } from "@env";
import axios, { AxiosRequestConfig, AxiosResponseHeaders } from "axios";

const instance = axios.create({
  baseURL: SERVER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("current server: ", SERVER_ENDPOINT);

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

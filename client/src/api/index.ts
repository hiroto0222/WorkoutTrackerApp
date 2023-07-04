import { SERVER_ENDPOINT } from "@env";
import axios from "axios";

const instance = axios.create({
  baseURL: SERVER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export default instance;

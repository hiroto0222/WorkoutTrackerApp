import { SERVER_ENDPOINT } from "@env";
import axios from "axios";

const instance = axios.create({
  baseURL: SERVER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;

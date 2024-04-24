import axios from "axios";

import {
  SECRET_KEY,
  SERVER_URL,
} from "../constants.js";

const apiClient = axios.create({
  baseURL: `${SERVER_URL}/api`,
});


export default apiClient;

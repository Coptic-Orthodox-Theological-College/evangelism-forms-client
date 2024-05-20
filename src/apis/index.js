import axios from "axios";

import {
  SERVER_URL,
} from "../constants.js";

const apiClient = axios.create({
  baseURL: `${SERVER_URL}/api`,
});


export default apiClient;

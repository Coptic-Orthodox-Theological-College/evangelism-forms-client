import axios from "axios";
// import jwtDecode from "jwt-decode";

import {
  SECRET_KEY,
  SERVER_URL,
} from "../constants.js";

const apiClient = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

// apiClient.interceptors.request.use(async (request) => {
//   const accessToken = localStorage.getItem(SECRET_KEY);

//   if (accessToken) {
//     // Check if the token is expired
//     const expiresAt = localStorage.getItem("expiresAt");
//     if (expiresAt) {
//       const currentTime = new Date().getTime();
//       const expirationTime = new Date(expiresAt).getTime();
//       console.log("Access token", currentTime, expirationTime);
//       if (currentTime > expirationTime) {
//         // Token has expired, redirect to login
//         console.log("token expired going to login page");
//         localStorage.removeItem(SECRET_KEY); // Clear the expired token
//         localStorage.removeItem("expiresAt"); // Clear the expiration time
//         window.location.href = "/login"; // Replace with your login route
//         return Promise.reject("Token expired"); // Reject the request
//       }
//     }

//     // Token is valid, set the Authorization header
//     request.headers.Authorization = `Bearer ${accessToken}`;

//     // Decode the JWT token to check expiration
//     const decodedToken = jwtDecode(accessToken);
//     // console.log("decoded token",decodedToken);
//     const currentTime = Date.now() / 1000; // Convert to seconds

//     if (decodedToken.exp < currentTime) {
//       localStorage.removeItem(SECRET_KEY); // Clear the expired token
//       window.location.href = "/login";
//     }
//   }

//   return request;
// });


export default apiClient;

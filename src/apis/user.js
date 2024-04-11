import apiClient from ".";

export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/users/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
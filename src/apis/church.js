import apiClient from ".";

export const getChurch = async (token) => {
  try {
    const response = await apiClient.get("/churches/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export const createChurch = async (name = '', address = '', token) => {
  try {
    const response = await apiClient.post("/churches/add", {
      name,
      address,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
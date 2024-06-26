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

export const createChurch = async (name = '', address = '', token, responsiblePerson = '', phone = '') => {
  try {
    const response = await apiClient.post("/churches/add", {
      name,
      address,
      responsiblePerson,
      phone,
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

export const updateChurch = async (data = {}, token) => {
  try {
    const response = await apiClient.put("/churches/update", {
      ...data
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

export const getAllChurchSubbmissions = async (token) => {
  try {
    const response = await apiClient.get("/churches/get-all-submissions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
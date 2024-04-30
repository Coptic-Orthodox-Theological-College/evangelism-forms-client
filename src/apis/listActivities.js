import apiClient from ".";

export const listActivities = async () => {
  try {
    const response = await apiClient.get("/activities/list");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

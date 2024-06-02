import apiClient from ".";

export const listActivities = async () => {
  try {
    const response = await apiClient.get("/activities/list");

    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

import apiClient from ".";

export const listActivities = async () => {
  try {
    const response = await apiClient.get("/activities/list");
    console.log("🚀 ~ listActivities ~ response:", response)

    return response.data;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

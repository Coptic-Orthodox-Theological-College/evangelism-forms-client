import apiClient from ".";

export const submitForm = async (allData, formTemplateId, userId) => {
  try {
    const response = await apiClient.post("/forms/submit", {
      allData,
      formTemplateId,
      userId,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

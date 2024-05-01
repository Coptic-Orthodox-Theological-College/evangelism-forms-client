import apiClient from ".";

export const submitForm = async (allData, formTemplateId, token) => {
  try {
    const response = await apiClient
      .post(
        `/forms/submit/${formTemplateId}`,
        allData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

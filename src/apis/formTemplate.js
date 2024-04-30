import apiClient from ".";

export const getFormTemplate = async (FormTemplateId) => {
  try {
    const response = await apiClient.get(`/form-templates/${FormTemplateId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export const listFormTemplatesByActivity = async (activityId) => {
  try {
    const response = await apiClient.get(`/form-templates/list/${activityId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
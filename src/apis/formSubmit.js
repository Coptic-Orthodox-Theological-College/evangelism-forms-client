import apiClient from ".";

export const submitForm = async (allData, formTemplateId, token) => {
  try {
    const response = await apiClient
      .post(
        `/form-submissions/submit/${formTemplateId}`,
        { allData },
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

export const getOneSubmission = async (submissionId, token) => {
  try {
    const response = await apiClient.get(`/form-submissions/one/${submissionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteSubmission = async (submissionId, token) => {
  try {
    const response = await apiClient.delete(`/form-submissions/delete/${submissionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export const updateSubmission = async (submissionId, allData, token) => {
  try {
    const response = await apiClient.put(`/form-submissions/update/${submissionId}`, { allData }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}
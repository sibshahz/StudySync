import { axios_default } from "../axios-core";

export const getDepartments = async (orgId: string) => {
  try {
    const response = await axios_default.get(`/departments/${orgId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
};

export const createDepartment = async (data) => {
  try {
    const response = await axios_default.post(
      `/departments/${data.organizationId}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create department:", error);
    return null;
  }
};

export const updateDepartment = async (id, data) => {
  try {
    const response = await axios_default.put(`/departments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update department:", error);
    return null;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await axios_default.delete(`/departments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete department:", error);
    return null;
  }
};

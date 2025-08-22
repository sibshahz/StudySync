import { axios_default } from "../axios-core";

export const getAllOrgStudents = async (orgId: string): Promise<[]> => {
  try {
    const response = await axios_default.get(`students/${orgId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch org members:", error);
    return [];
  }
};

export const deleteOrgStudents = async (memberId: string): Promise<any> => {
  try {
    const response = await axios_default.delete(`students/${memberId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete org member", error);
    return null;
  }
};

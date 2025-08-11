import { axios_default } from "../axios-core";

export const getAllOrgMembers = async (orgId: string): Promise<[]> => {
  try {
    const response = await axios_default.get(`members/${orgId}`);
    console.log("*** Response from getAllOrgMembers:", response);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch org members:", error);
    return [];
  }
};

export const deleteOrgMembers = async (memberId: string): Promise<any> => {
  try {
    const response = await axios_default.delete(`members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete org member", error);
    return null;
  }
}

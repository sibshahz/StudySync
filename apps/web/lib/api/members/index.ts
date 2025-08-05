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

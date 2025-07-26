import { axios_default } from "../axios-core";
import { UserOrganization } from "@/lib/store/common/orgsSlice";
export const getAllOrganizations = async (): Promise<UserOrganization[]> => {
  try {
    const response = await axios_default.get(`org`);
    console.log("*** Response from getAllOrganizations:", response);
    return response.data as UserOrganization[];
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return [];
  }
};

import { axios_default } from "../axios-core";

export const getAllOrganizations = async () => {
  try {
    const response = await axios_default.get(`org`);
    return response;
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return error;
  }
};

import { FYPProject } from "@/types/types";
import { axios_default } from "../axios-core";

export const getAllProjects = async (): Promise<FYPProject[]> => {
  try {
    const response = await axios_default.get(`project`);
    console.log("*** Response from getAllProjects:", response);
    return response.data as FYPProject[];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
};

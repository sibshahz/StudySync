import { FYPProject } from "@/types/types";
import { axios_default } from "../axios-core";

export const getAllProjects = async (): Promise<FYPProject[]> => {
  try {
    const response = await axios_default.get(`project`);
    return response.data as FYPProject[];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
};

export const getProjectSelectionDetails = async (
  projectId: string,
): Promise<FYPProject | null> => {
  try {
    const response = await axios_default.get(`project/details/${projectId}`);
    console.log("*** AXIOS project details response: ", response);
    return response.data as FYPProject;
  } catch (error) {
    console.error("Failed to fetch project details:", error);
    return null;
  }
};

export const getSelectFYPProject = async (
  projectId: string,
): Promise<FYPProject | null> => {
  try {
    const response = await axios_default.get(`project/select/${projectId}`);
    return response.data as FYPProject;
  } catch (error) {
    console.error("Failed to fetch project select:", error);
    return error.response.data.message;
  }
};

export const getStudentProjectDetails =
  async (): Promise<FYPProject | null> => {
    try {
      const response = await axios_default.get(`project/student/details/`);
      return response.data as FYPProject;
    } catch (error) {
      console.error("Failed to fetch student project details:", error);
      return null;
    }
  };

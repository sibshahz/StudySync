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
): Promise<{ success: boolean; data?: FYPProject; message?: string }> => {
  try {
    const response = await axios_default.get(`project/details/${projectId}`);
    // If your backend returns { success, data, message }
    if (response.data?.success === false) {
      return {
        success: false,
        message: response.data?.message || "Failed to fetch project details.",
      };
    }
    return {
      success: true,
      data: response.data as FYPProject,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch project details.",
    };
  }
};

export const getSelectFYPProject = async (
  projectId: string,
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await axios_default.get(`project/select/${projectId}`);
    if (response.data?.success === false) {
      return {
        success: false,
        message: response.data?.message || "Failed to select FYP project.",
      };
    }
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to select FYP project.",
    };
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

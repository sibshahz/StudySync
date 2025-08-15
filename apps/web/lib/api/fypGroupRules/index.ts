import axios_default from "../axios-core";
import type {
  CreateFYPGroupRulesInput,
  EditFYPGroupRulesInput,
  FYPGroupRules,
} from "@/types/types";

export const getAllFYPGroupRules = async (
  orgId: string,
): Promise<FYPGroupRules[]> => {
  try {
    const response = await axios_default.get(`/fyp-group-rules/org/${orgId}`);
    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch FYP group rules:", error);
    return [];
  }
};

export const getFYPGroupRulesById = async (
  id: string,
): Promise<FYPGroupRules | null> => {
  try {
    const response = await axios_default.get(`/fyp-group-rules/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch FYP group rules by ID:", error);
    return null;
  }
};

export const getFYPGroupRulesByBatchId = async (
  batchId: string,
): Promise<FYPGroupRules | null> => {
  try {
    const response = await axios_default.get(
      `/fyp-group-rules/batch/${batchId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch FYP group rules by batch ID:", error);
    return null;
  }
};

export const createFYPGroupRules = async (data: CreateFYPGroupRulesInput) => {
  try {
    const response = await axios_default.post(
      `/fyp-group-rules/batch/${data.batchId}`,
      {
        minMembers: data.minMembers,
        maxMembers: data.maxMembers,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create FYP group rules:", error);
    throw error;
  }
};

export const updateFYPGroupRules = async (data: EditFYPGroupRulesInput) => {
  try {
    const response = await axios_default.put(
      `/fyp-group-rules/batch/${data.batchId}`,
      {
        minMembers: data.minMembers,
        maxMembers: data.maxMembers,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update FYP group rules:", error);
    throw error;
  }
};

export const deleteFYPGroupRules = async (batchId: string) => {
  try {
    const response = await axios_default.delete(
      `/fyp-group-rules/batch/${batchId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete FYP group rules:", error);
    throw error;
  }
};

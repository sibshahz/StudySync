import axios_default from "../axios-core";
import type {
  CreateBatchInput,
  EditBatchInput,
  BatchEntity,
} from "@/types/types";

export const getAllBatches = async (orgId: string) => {
  try {
    const response = await axios_default.get(`/batch/${orgId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch batches:", error);
    return [];
  }
};

export const getSingleBatch = async (batchId: string) => {
  try {
    const response = await axios_default.get(`/batch/${batchId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch batch:", error);
    return null;
  }
};

export const createBatch = async (data: CreateBatchInput) => {
  try {
    const response = await axios_default.post(`/batch/${data.departmentId}`, {
      name: data.name,
      batchYear: data.batchYear,
      batchCode: data.batchCode,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create batch:", error);
    throw error;
  }
};

export const updateBatch = async (data: EditBatchInput) => {
  try {
    const response = await axios_default.put(
      `/batch/${data.departmentId}/${data.id}`,
      {
        name: data.name,
        batchYear: data.batchYear,
        batchCode: data.batchCode,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update batch:", error);
    throw error;
  }
};

export const deleteBatch = async (
  orgId: string,
  deptId: string,
  batchId: string,
) => {
  try {
    const response = await axios_default.delete(
      `/batch/${orgId}/${deptId}/${batchId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete batch:", error);
    throw error;
  }
};

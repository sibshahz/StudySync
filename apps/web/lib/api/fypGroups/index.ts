import { axios_default } from "../axios-core";

export const getFypGroups = async (
  orgId: string,
  deptId: string,
  batchId: string,
) => {
  try {
    const response = await axios_default.get(
      `/fyp-groups/all/${orgId}/${deptId}/${batchId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching FYP groups:", error);
    throw error;
  }
};

import { axios_default } from "../axios-core";
import { JoinCode } from "@repo/database/enums";
export const getOrganizationJoinCodes = async (orgId: string) => {
  try {
    const response = await axios_default.get(`joincode/orgs/${orgId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch join codes: ", error);
  }
};

export const createJoinCode = async ({
  organizationId,
  role,
  usageLimit,
  expiresAt,
}: Omit<JoinCode, "id" | "code" | "createdAt" | "updatedAt" | "usedCount">) => {
  try {
    const response = await axios_default.post("joincode/create", {
      organizationId: organizationId,
      role: role,
      usageLimit: usageLimit,
      expiresAt: expiresAt,
    });
    console.log("*** Response from create join: ", response);
    return response.data;
  } catch (error) {
    console.error("Failed to create join codes: ", error);
  }
};

export const updateJoinCode = async ({
  id,
  usageLimit,
  expiresAt,
}: Omit<JoinCode, "code" | "organizationId" | "role">) => {
  try {
    const response = await axios_default.post("joincode/update", {
      data: {
        id: id,
        usageLimit: usageLimit,
        expiresAt: expiresAt,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create join codes: ", error);
  }
};

export const deleteJoinCode = async (id: string) => {
  try {
    const response = await axios_default.delete(`joincode/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to create join codes: ", error);
  }
};

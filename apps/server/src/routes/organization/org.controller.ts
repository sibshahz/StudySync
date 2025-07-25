import { Request, Response } from "express";
import * as orgService from "@/services/orgService";

export const getUserAllOrganizations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const organizations = await orgService.getUserOrganizations(userId);
    res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrganization = async (req: Request, res: Response) => {
  const { orgId } = req.params;
  try {
    const organization = await orgService.getOrganization(orgId || "");
    if (!organization) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }
    res.status(200).json({ success: true, data: organization });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

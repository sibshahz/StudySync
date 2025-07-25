import { Request, Response } from "express";
import * as orgService from "@/services/orgService";

export const getAllOrganizations = async (req: Request, res: Response) => {
  try {
    const organizations = await orgService.getAllOrganizations();
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

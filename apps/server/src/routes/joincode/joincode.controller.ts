import { Request, Response } from "express";
import * as joinCodeService from "@/services/joinCodeService"; // Adjust the import path as necessary

export const getJoinCodeById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const joinCode = await joinCodeService.getJoinCodeById(
      req.params.joincodeId || ""
    );
    res.status(200).json({
      success: true,
      data: joinCode,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getOrganizationJoinCodes = async (req: Request, res: Response) => {
  const { orgId } = req.params;
  try {
    const joinCodes = await joinCodeService.getOrganizationJoinCodes(
      orgId || ""
    );
    if (!joinCodes) {
      res.status(404).json({ success: false, message: "No join codes found" });
      return;
    }
    res.status(200).json({ success: true, data: joinCodes });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const createJoinCode = async (req: Request, res: Response) => {
  try {
    const { organizationId, usageLimit, expiresAt, role } = req.body;
    const data = req.body;
    if (!organizationId || !role) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: organizationId, user role",
      });
      return;
    }
    const joinCode = await joinCodeService.createJoinCode(data);
    res.status(201).json({
      success: true,
      message: "Join code created successfully",
      data: joinCode,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

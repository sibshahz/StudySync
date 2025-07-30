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
  const orgId = req.params.orgId || req.query.orgId;
  if (!orgId) {
    res.status(400).json({
      success: false,
      message: "Missing required organization ID",
    });
    return;
  }
  try {
    const joinCodes = await joinCodeService.getOrganizationJoinCodes(orgId);
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
    console.log("*** Create join code request: ", req.body);
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

export const updateJoinCode = async (req: Request, res: Response) => {
  try {
    const { id, usageLimit, expiresAt } = req.body;
    const data = {
      id: Number(id),
      usageLimit: Number(usageLimit),
      expiresAt,
    };
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Missing required join code id",
      });
      return;
    }
    const joinCode = await joinCodeService.updateJoinCode(data);
    res.status(201).json({
      success: true,
      message: "Join code created successfully",
      data: joinCode,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteJoinCode = async (req: Request, res: Response) => {
  try {
    const id = req.params.joincodeId;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Missing required join code id",
      });
      return;
    }

    const joinCode = await joinCodeService.deleteJoinCode(id);
    res.status(201).json({
      success: true,
      message: "Join code deleted successfully",
      data: joinCode,
    });
    return;
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
    return;
  }
};

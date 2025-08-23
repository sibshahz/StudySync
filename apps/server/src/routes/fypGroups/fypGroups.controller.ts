import { Request, Response } from "express";
import * as fypGroupService from "@/services/fypGroupService";

export const getAllFYPGroups = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const fypGroups = await fypGroupService.getAllFYPGroups(Number(orgId));
    res.status(200).json({
      success: true,
      data: fypGroups,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

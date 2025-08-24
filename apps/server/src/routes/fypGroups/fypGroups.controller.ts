import { Request, Response } from "express";
import * as fypGroupService from "@/services/fypGroupService";

export const getAllFYPGroups = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const depId = req.params.depId;
    const batchId = req.params.batchId;

    const fypGroups = await fypGroupService.getAllFYPGroups(
      Number(orgId),
      Number(depId),
      Number(batchId)
    );
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

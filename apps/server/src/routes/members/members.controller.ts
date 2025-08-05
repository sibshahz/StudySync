import { Request, Response } from "express";
import * as memberService from "@/services/memberService";
export const getAllOrgMembers = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const members = await memberService.getAllOrgMembers(String(orgId));
    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

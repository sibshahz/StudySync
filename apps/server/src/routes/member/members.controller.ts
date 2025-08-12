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


export const deleteOrgMember = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.memberId;
    const deletedMember = await memberService.deleteOrgMember(String(memberId));
    res.status(201).json({
      success: true,
      data: deletedMember
    });
  } catch (error:any) {
    res.status(500).json({success:false,message: error.message})
  }
}
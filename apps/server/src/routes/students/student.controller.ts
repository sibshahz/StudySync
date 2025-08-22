import { Request, Response } from "express";
import * as studentService from "@/services/studentService";
export const getAllOrgStudents = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const students = await studentService.getAllOrgStudents(Number(orgId));
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

import { Request, Response } from "express";
import * as projService from "@/services/projService";

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projService.getAllProjects();
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

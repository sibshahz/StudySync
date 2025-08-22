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

export const getProjectSelectionDetails = async (
  req: Request,
  res: Response
) => {
  const { projId } = req.params;
  const userId = req.user?.id;
  try {
    const project = await projService.getProjectSelectionDetails(
      Number(projId),
      Number(userId)
    );
    if (!project) {
      res.status(404).json({
        success: false,
        data: "Project not selected by anyone in this batch",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: project,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getSelectProject = async (req: Request, res: Response) => {
  const { projId } = req.params;
  const userId = req.user?.id;
  try {
    const projectSelected = await projService.getSelectProject(
      Number(projId),
      Number(userId)
    );

    res.status(200).json({
      success: true,
      data: projectSelected,
    });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

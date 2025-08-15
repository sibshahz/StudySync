import { Request, Response } from "express";
import * as semesterService from "@/services/semesterService";

export const getAllSemesters = async (req: Request, res: Response): Promise<void> => {
  try {
    const batchId = req.params.batchId;
    const semesters = await semesterService.getAllSemesters(String(batchId));
    res.status(200).json({
      success: true,
      data: semesters,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAvailableSemesters = async (req: Request, res: Response): Promise<void> => {
  try {
    const semesters = await semesterService.getAllAvailableSemesters();
    res.status(200).json({
      success: true,
      data: semesters,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleSemester = async (req: Request, res: Response): Promise<void> => {
  try {
    const semesterId = req.params.semesterId;
    const semester = await semesterService.getSingleSemester(String(semesterId));
    
    if (!semester) {
      res.status(404).json({
        success: false,
        message: "Semester not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: semester,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSemester = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, semesterSeason, startDate, endDate } = req.body;
    
    const newSemester = await semesterService.createSemester(
      name,
      semesterSeason,
      new Date(startDate),
      new Date(endDate)
    );

    if (!newSemester) {
      res.status(400).json({
        success: false,
        message: "Failed to create semester",
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: newSemester,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSemester = async (req: Request, res: Response): Promise<void> => {
  try {
    const semesterId = req.params.semesterId;
    const { name, semesterSeason, startDate, endDate } = req.body;
    
    const updatedSemester = await semesterService.updateSemester(
      String(semesterId),
      name,
      semesterSeason,
      new Date(startDate),
      new Date(endDate)
    );

    if (!updatedSemester) {
      res.status(404).json({
        success: false,
        message: "Semester not found or failed to update",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedSemester,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSemester = async (req: Request, res: Response): Promise<void> => {
  try {
    const semesterId = req.params.semesterId;
    const deletedSemester = await semesterService.deleteSemester(String(semesterId));

    if (!deletedSemester) {
      res.status(404).json({
        success: false,
        message: "Semester not found or failed to delete",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Semester deleted successfully",
      data: deletedSemester,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const enrollBatchInSemester = async (req: Request, res: Response): Promise<void> => {
  try {
    const batchId = req.params.batchId;
    const semesterId = req.params.semesterId;
    
    const result = await semesterService.enrollBatchInSemester(
      String(batchId),
      String(semesterId)
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Failed to enroll batch in semester",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Batch enrolled in semester successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unenrollBatchFromSemester = async (req: Request, res: Response): Promise<void> => {
  try {
    const batchId = req.params.batchId;
    const semesterId = req.params.semesterId;
    
    const result = await semesterService.unenrollBatchFromSemester(
      String(batchId),
      String(semesterId)
    );

    if (!result) {
      res.status(400).json({
        success: false,
        message: "Failed to unenroll batch from semester",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Batch unenrolled from semester successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBatchSemesterEnrollment = async (req: Request, res: Response): Promise<void> => {
  try {
    const batchId = req.params.batchId;
    const enrollment = await semesterService.getBatchSemesterEnrollment(String(batchId));

    if (!enrollment) {
      res.status(404).json({
        success: false,
        message: "Batch not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

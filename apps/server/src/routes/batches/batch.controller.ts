import { Request, Response } from "express";

import * as batchService from "@/services/batchService";

export const getAllBatches = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const batches = await batchService.getAllBatches(String(orgId));
    res.status(200).json({
      success: true,
      data: batches,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleBatch = async (req: Request, res: Response) => {
  try {
    const batchId = req.params.batchId;
    const batch = await batchService.getSingleBatch(String(batchId));
    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBatch = async (req: Request, res: Response) => {
  try {
    const deptId = req.params.deptId;
    const { name } = req.body;
    const newBatch = await batchService.createBatch(String(deptId), name);
    res.status(201).json({
      success: true,
      data: newBatch,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBatch = async (req: Request, res: Response) => {
  try {
    const deptId = req.params.deptId;
    const batchId = req.params.batchId;
    const { name } = req.body;
    const updatedBatch = await batchService.updateBatch(
      String(deptId),
      String(batchId),
      name
    );
    res.status(200).json({
      success: true,
      data: updatedBatch,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBatch = async (req: Request, res: Response) => {
  try {
    const deptId = req.params.deptId;
    const batchId = req.params.batchId;
    await batchService.deleteBatch(String(deptId), String(batchId));
    res.status(204).json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignStudentBatch = async (req: Request, res: Response) => {
  try {
    const { studentIds, batch } = req.body;
    console.log("***assign body", { studentIds, batch });
    const result = await batchService.assignStudentBatch({
      studentIds,
      batch,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

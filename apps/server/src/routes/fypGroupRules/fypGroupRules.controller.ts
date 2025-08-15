import { Request, Response } from "express";

import * as fypGroupRulesService from "@/services/fypGroupRulesService";

export const getAllFYPGroupRules = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const groupRules = await fypGroupRulesService.getAllFYPGroupRules(
      String(orgId)
    );
    res.status(200).json({
      success: true,
      data: groupRules,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFYPGroupRulesByBatchId = async (
  req: Request,
  res: Response
) => {
  try {
    const batchId = req.params.batchId;
    const groupRules = await fypGroupRulesService.getFYPGroupRulesByBatchId(
      String(batchId)
    );

    if (!groupRules) {
      return res.status(404).json({
        success: false,
        message: "FYP group rules not found for this batch",
      });
    }

    res.status(200).json({
      success: true,
      data: groupRules,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFYPGroupRulesById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const groupRules = await fypGroupRulesService.getFYPGroupRulesById(
      String(id)
    );

    if (!groupRules) {
      return res.status(404).json({
        success: false,
        message: "FYP group rules not found",
      });
    }

    res.status(200).json({
      success: true,
      data: groupRules,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFYPGroupRules = async (req: Request, res: Response) => {
  try {
    const batchId = req.params.batchId;
    const { minMembers, maxMembers } = req.body;

    // Validation
    if (minMembers && maxMembers && minMembers > maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Minimum members cannot be greater than maximum members",
      });
    }

    const newGroupRules = await fypGroupRulesService.createFYPGroupRules(
      String(batchId),
      minMembers || 1,
      maxMembers || 4
    );

    if (!newGroupRules) {
      return res.status(400).json({
        success: false,
        message:
          "Failed to create FYP group rules. Rules may already exist for this batch.",
      });
    }

    res.status(201).json({
      success: true,
      data: newGroupRules,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFYPGroupRules = async (req: Request, res: Response) => {
  try {
    const batchId = req.params.batchId;
    const { minMembers, maxMembers } = req.body;

    // Validation
    if (minMembers && maxMembers && minMembers > maxMembers) {
      return res.status(400).json({
        success: false,
        message: "Minimum members cannot be greater than maximum members",
      });
    }

    const updatedGroupRules = await fypGroupRulesService.updateFYPGroupRules(
      String(batchId),
      minMembers,
      maxMembers
    );

    if (!updatedGroupRules) {
      return res.status(404).json({
        success: false,
        message: "FYP group rules not found for this batch",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedGroupRules,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFYPGroupRules = async (req: Request, res: Response) => {
  try {
    const batchId = req.params.batchId;
    const deletedGroupRules = await fypGroupRulesService.deleteFYPGroupRules(
      String(batchId)
    );

    if (!deletedGroupRules) {
      return res.status(404).json({
        success: false,
        message: "FYP group rules not found for this batch",
      });
    }

    res.status(200).json({
      success: true,
      message: "FYP group rules deleted successfully",
      data: deletedGroupRules,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

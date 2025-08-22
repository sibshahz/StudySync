import { Request, Response } from "express";
import * as departmentService from "@/services/departmentService";

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const departments = await departmentService.getAllDepartments(
      String(orgId)
    );
    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleDepartment = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const deptId = req.params.deptId;
    const department = await departmentService.getSingleDepartment(
      String(orgId),
      String(deptId)
    );
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const { name } = req.body;
    const newDepartment = await departmentService.createDepartment(
      String(orgId),
      name
    );
    res.status(201).json({
      success: true,
      data: newDepartment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const deptId = req.params.deptId;
    const { name } = req.body;
    const updatedDepartment = await departmentService.updateDepartment(
      String(orgId),
      String(deptId),
      name
    );
    res.status(200).json({
      success: true,
      data: updatedDepartment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const deptId = req.params.deptId;
    await departmentService.deleteDepartment(String(orgId), String(deptId));
    res.status(204).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addDepartmentStudent = async (req: Request, res: Response) => {
  try {
    const orgId = req.params.orgId;
    const deptId = req.params.deptId;
    const students = req.body.students; // Expecting an array of student objects
    const addedStudents = await departmentService.addDepartmentStudent(
      String(orgId),
      String(deptId),
      students
    );
    res.status(201).json({
      success: true,
      data: addedStudents,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

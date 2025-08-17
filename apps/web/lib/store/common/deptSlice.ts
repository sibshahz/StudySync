import { getDepartments } from "@/lib/api/departments";

import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Department } from "@repo/database/enums";

export type DepartmentType = {
  id: number;
  name: string;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    students: number;
    teachers: number;
    batches: number;
  };
};

export interface DepartmentState {
  departments: DepartmentType[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: DepartmentState = {
  departments: [],
  status: "idle",
};

export const fetchDepartments = createAsyncThunk<DepartmentType[], string>(
  "departments/fetch_departments",
  async (orgId) => {
    const departments = await getDepartments(orgId);
    return departments as DepartmentType[];
  },
);

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default departmentSlice.reducer;

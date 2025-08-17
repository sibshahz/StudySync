import { getAllBatches } from "@/lib/api/batches";

import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Batch } from "@repo/database/enums";

export type BatchType = {
  id: number;
  name: string;
  batchCode: string;
  batchYear: number;
  departmentId: number;
  departmentName: string;
  studentCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  _count: {
    students: number;
  };
};

export interface BatchState {
  batches: BatchType[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: BatchState = {
  batches: [],
  status: "idle",
};

export const fetchBatches = createAsyncThunk<BatchType[], string>(
  "batches/fetch_batches",
  async (orgId) => {
    const batches = await getAllBatches(orgId);
    return batches as BatchType[];
  },
);

const batchSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.batches = action.payload;
      })
      .addCase(fetchBatches.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export default batchSlice.reducer;

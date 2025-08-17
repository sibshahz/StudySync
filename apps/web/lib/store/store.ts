import { configureStore } from "@reduxjs/toolkit";
import organizationSlice from "./common/orgsSlice";
import departmentSlice from "./common/deptSlice";
import batchSlice from "./common/batchSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      organizations: organizationSlice,
      departments: departmentSlice,
      batches: batchSlice, // Assuming batchSlice is imported from the appropriate file
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

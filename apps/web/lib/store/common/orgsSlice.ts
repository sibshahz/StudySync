import { getAllOrganizations } from "@/lib/api/organization";
import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@repo/database/enums";

export type UserOrganization = {
  id: number;
  name: string;
  role: string;
  updatedAt: string;
  createdAt: string;
  userId: number;
};

export interface OrganizationState {
  userOrganizations: UserOrganization[];

  userDefaultOrganization?: {
    id: number;
    name: string;
    role: string;
    updatedAt: Date;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  selectedOrganization?: UserOrganization;
}

const initialState: OrganizationState = {
  userDefaultOrganization: undefined,
  userOrganizations: [],
  selectedOrganization: undefined,
  status: "idle",
};

export const fetchOrganizations = createAsyncThunk<UserOrganization[]>(
  "organizations/fetch_user_organizations",
  async () => {
    const organizations = await getAllOrganizations();
    return organizations as UserOrganization[];
  },
);

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    resetOrganizations: (state) => {
      state.userDefaultOrganization = undefined;
      state.userOrganizations = [];
      state.status = "idle";
    },
    setUserOrganizations: (
      state,
      action: PayloadAction<UserOrganization[]>,
    ) => {
      state.userOrganizations = action.payload;
      state.status = "succeeded";
    },
    setSelectedOrganization: (
      state,
      action: PayloadAction<UserOrganization | undefined>,
    ) => {
      state.selectedOrganization = action.payload;
    },
    // Additional reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchOrganizations.fulfilled,
        (state, action: PayloadAction<UserOrganization[]>) => {
          state.status = "succeeded";
          state.userOrganizations = action.payload;
          state.selectedOrganization =
            action.payload.length > 0 ? action.payload[0] : undefined;
        },
      )
      .addCase(fetchOrganizations.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {
  resetOrganizations,
  setUserOrganizations,
  setSelectedOrganization,
  // setFlowSettings,
  // setThemeStyles,
  // setHeaderPosition,
  // setPartialStyles,
  // setBackgroundColors,
  // setMobileScreen,
  // setPrimaryColors,
  // setTextColors,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;

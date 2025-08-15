import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
  currentPath: string;
  activeMainItem: string | null;
  activeSubItem: string | null;
  openCollapsibles: string[];
}

const initialState: NavigationState = {
  currentPath: "/dashboard",
  activeMainItem: null,
  activeSubItem: null,
  openCollapsibles: [],
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;

      // Auto-determine active items based on current path
      const path = action.payload;

      // Reset active items
      state.activeMainItem = null;
      state.activeSubItem = null;

      // Determine which main item and sub item should be active
      if (path.startsWith("/dashboard/organizations")) {
        state.activeMainItem = "Organization";
        if (path.includes("/departments")) {
          state.activeSubItem = "Departments";
        } else if (path.includes("/batches")) {
          state.activeSubItem = "Batches";
        } else if (path.includes("/members")) {
          state.activeSubItem = "Members";
        } else if (path.includes("/joincodes")) {
          state.activeSubItem = "Access Codes";
        } else {
          state.activeSubItem = "Overview";
        }
      } else if (path.startsWith("/dashboard/fyp")) {
        state.activeMainItem = "FYP Management";
        if (path.includes("/projects")) {
          state.activeSubItem = "Projects";
        } else if (path.includes("/group-rules")) {
          state.activeSubItem = "FYP Group Rules";
        } else if (path.includes("/supervisors")) {
          state.activeSubItem = "Supervisors";
        } else if (path.includes("/evaluations")) {
          state.activeSubItem = "Evaluations";
        }
      } else if (path.startsWith("/dashboard/teachers")) {
        state.activeMainItem = "Teachers";
        if (path.includes("/assignments")) {
          state.activeSubItem = "Assign Courses";
        } else if (path.includes("/attendance")) {
          state.activeSubItem = "Attendance";
        } else {
          state.activeSubItem = "All Teachers";
        }
      } else if (path.startsWith("/dashboard/students")) {
        state.activeMainItem = "Students";
        if (path.includes("/admissions")) {
          state.activeSubItem = "Admissions";
        } else if (path.includes("/enrollment")) {
          state.activeSubItem = "Enrollment Status";
        } else {
          state.activeSubItem = "All Students";
        }
      } else if (path.startsWith("/dashboard/semesters")) {
        state.activeMainItem = "Semesters";
        if (path.includes("/create")) {
          state.activeSubItem = "Create Semester";
        } else if (path.includes("/calendar")) {
          state.activeSubItem = "Semester Calendar";
        } else {
          state.activeSubItem = "All Semesters";
        }
      } else if (
        path.startsWith("/dashboard/courses") ||
        path.startsWith("/dashboard/assignments") ||
        path.startsWith("/dashboard/quizzes")
      ) {
        state.activeMainItem = "Courses & Assignments";
        if (path.includes("/assignments")) {
          state.activeSubItem = "Assignments";
        } else if (path.includes("/quizzes")) {
          state.activeSubItem = "Quizzes";
        } else {
          state.activeSubItem = "Courses";
        }
      } else if (path.startsWith("/dashboard/grading")) {
        state.activeMainItem = "Grading & Results";
        if (path.includes("/schemes")) {
          state.activeSubItem = "Grading Schemes";
        } else if (path.includes("/results")) {
          state.activeSubItem = "Results";
        } else if (path.includes("/reports")) {
          state.activeSubItem = "Reports";
        }
      } else if (path.startsWith("/dashboard/settings")) {
        state.activeMainItem = "Settings";
        if (path.includes("/general")) {
          state.activeSubItem = "General";
        } else if (path.includes("/team")) {
          state.activeSubItem = "Team";
        } else if (path.includes("/billing")) {
          state.activeSubItem = "Billing";
        } else if (path.includes("/access")) {
          state.activeSubItem = "Access Control";
        }
      } else if (path === "/dashboard") {
        state.activeMainItem = "Dashboard";
        state.activeSubItem = "Overview";
      }

      // Auto-open collapsibles for active items
      if (
        state.activeMainItem &&
        !state.openCollapsibles.includes(state.activeMainItem)
      ) {
        state.openCollapsibles.push(state.activeMainItem);
      }
    },

    setActiveMainItem: (state, action: PayloadAction<string | null>) => {
      state.activeMainItem = action.payload;
    },

    setActiveSubItem: (state, action: PayloadAction<string | null>) => {
      state.activeSubItem = action.payload;
    },

    toggleCollapsible: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      const index = state.openCollapsibles.indexOf(item);

      if (index >= 0) {
        state.openCollapsibles.splice(index, 1);
      } else {
        state.openCollapsibles.push(item);
      }
    },

    openCollapsible: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      if (!state.openCollapsibles.includes(item)) {
        state.openCollapsibles.push(item);
      }
    },

    closeCollapsible: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      const index = state.openCollapsibles.indexOf(item);
      if (index >= 0) {
        state.openCollapsibles.splice(index, 1);
      }
    },
  },
});

export const {
  setCurrentPath,
  setActiveMainItem,
  setActiveSubItem,
  toggleCollapsible,
  openCollapsible,
  closeCollapsible,
} = navigationSlice.actions;

export default navigationSlice.reducer;

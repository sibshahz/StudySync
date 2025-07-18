import { ProtectedRoute } from "@/components/auth/protected-route";
import DashboardContent from "@/components/dashboard/dashboard-content";
import { UserRole } from "@repo/database/enums";

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRoles={["TEACHER", "ADMIN"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

"use client";

import { useState } from "react";
import { CreateDepartment } from "./create-department";
import { ListDepartments } from "./list-department";

export default function DepartmentsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDepartmentCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage academic departments in your StudySync system.
          </p>
        </div>
        <CreateDepartment onDepartmentCreated={handleDepartmentCreated} />
      </div>

      <ListDepartments refreshTrigger={refreshTrigger} />
    </div>
  );
}

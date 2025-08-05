"use client";

import { useState } from "react";
import { CreateFYPProject } from "@/components/dashboard/projects/create-fyp-project";
import { ListFYPProjects } from "@/components/dashboard/projects/list-fyp-projects";

export default function FYPProjectsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProjectCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FYP Projects</h1>
          <p className="text-muted-foreground">
            Manage Final Year Projects in your StudySync system.
          </p>
        </div>
        <CreateFYPProject onProjectCreated={handleProjectCreated} />
      </div>

      <ListFYPProjects refreshTrigger={refreshTrigger} />
    </div>
  );
}

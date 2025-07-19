"use client";

import { useState } from "react";
import { CreateOrganization } from "./create-organization";
import { ListOrganizations } from "./list-organization";

export default function OrganizationsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrganizationCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage organizations in your StudySync system.
          </p>
        </div>
        <CreateOrganization onOrganizationCreated={handleOrganizationCreated} />
      </div>

      <ListOrganizations refreshTrigger={refreshTrigger} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { CreateMember } from "./create-member";
import { ListMembers } from "./list-members";
export default function MembersPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMemberCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Organization Members
          </h1>
          <p className="text-muted-foreground">
            Manage members, assign roles, and track academic progress in your
            organization.
          </p>
        </div>
        <CreateMember onMemberCreated={handleMemberCreated} />
      </div>

      <ListMembers refreshTrigger={refreshTrigger} />
    </div>
  );
}

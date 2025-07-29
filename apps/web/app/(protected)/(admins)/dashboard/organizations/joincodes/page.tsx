"use client";

import { useState } from "react";
import { CreateJoinCode } from "@/components/dashboard/organization/create-join-code";
import { ListJoinCodes } from "@/components/dashboard/organization/list-join-code";
export default function JoinCodesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleJoinCodeCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Join Codes</h1>
          <p className="text-muted-foreground">
            Create and manage join codes for user registration with specific
            roles and organizations.
          </p>
        </div>
        <CreateJoinCode onJoinCodeCreated={handleJoinCodeCreated} />
      </div>

      <ListJoinCodes refreshTrigger={refreshTrigger} />
    </div>
  );
}

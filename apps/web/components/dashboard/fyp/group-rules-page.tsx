"use client";

import { useState } from "react";
import { CreateFYPGroupRules } from "./create-fyp-group-rules";
import { ListFYPGroupRules } from "./list-fyp-group-rules";

export default function FYPGroupRulesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleGroupRulesCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FYP Group Rules</h1>
          <p className="text-muted-foreground">
            Manage Final Year Project group rules and member limits for each batch
          </p>
        </div>
        <CreateFYPGroupRules onGroupRulesCreated={handleGroupRulesCreated} />
      </div>

      <ListFYPGroupRules refreshTrigger={refreshTrigger} />
    </div>
  );
}

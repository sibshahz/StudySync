"use client";

import { useState } from "react";
import { CreateBatch } from "./create-batch";
import { ListBatches } from "./list-batches";

export default function BatchesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleBatchCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batches</h1>
          <p className="text-muted-foreground">
            Manage student batches and their department assignments
          </p>
        </div>
        <CreateBatch onBatchCreated={handleBatchCreated} />
      </div>

      <ListBatches refreshTrigger={refreshTrigger} />
    </div>
  );
}

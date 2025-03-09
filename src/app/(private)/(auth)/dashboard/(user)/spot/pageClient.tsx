"use client";

import { Separator } from "@/components/ui/separator";
import { SpotPayload, spotStore } from "@/lib/firebase/spot";
import { useEffect, useState } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default function DataPage() {
  const [spots, setSpots] = useState<SpotPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = spotStore.subscribe((updatedSpots) => {
      setSpots(updatedSpots);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="mx-auto w-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Spots</h1>
        <Separator className="my-4" />
      </div>

      <DataTable
        columns={columns}
        data={spots}
        loading={loading}
      />
    </div>
  );
}

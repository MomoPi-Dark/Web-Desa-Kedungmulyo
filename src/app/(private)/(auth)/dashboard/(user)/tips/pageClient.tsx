"use client";

import { Separator } from "@/components/ui/separator";
import { TipsPayload, tipsStore } from "@/lib/firebase/tips";
import { useEffect, useState } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default function DataPage() {
  const [spots, setSpots] = useState<TipsPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = tipsStore.subscribe((updatedTips) => {
      setSpots(updatedTips);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="mx-auto w-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tips</h1>
        <Separator className="my-4" />
      </div>

      <DataTable
        columns={columns as any[]}
        data={spots}
        loading={loading}
      />
    </div>
  );
}

"use client";

import { Separator } from "@/components/ui/separator";
import { UserPayload, usr } from "@/lib/firebase/users";
import { useEffect, useState } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default function DataPage() {
  const [users, setUsers] = useState<UserPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = usr.subscribe((updatedUsers) => {
      setUsers(updatedUsers);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="mx-auto w-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Separator className="my-4" />
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
      />
    </div>
  );
}

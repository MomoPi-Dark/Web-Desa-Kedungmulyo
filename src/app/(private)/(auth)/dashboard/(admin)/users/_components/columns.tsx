"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import ButtonActions from "./buttonActions";

export type UserData = {
  id: string;
  email: string;
  username: string;
};

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "id",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown />
        </Button>
      );
    },
    cell(props) {
      const username = props.row.getValue("username") as string;

      return (
        <div className="pl-5">
          <span>
            {username.length > 15 ? username.slice(0, 15) + "..." : username}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },

  {
    id: "actions",
    enableSorting: false,
    enableHiding: true,
    cell: ({ row, table }) => {
      return (
        <ButtonActions
          row={row}
          rowData={table.options.data}
        />
      );
    },
  },
];

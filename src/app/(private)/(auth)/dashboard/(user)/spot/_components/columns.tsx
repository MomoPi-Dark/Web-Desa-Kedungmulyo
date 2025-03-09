"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SpotPayload } from "@/lib/firebase/spot";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ButtonActions from "./buttonActions";

export const columns: ColumnDef<SpotPayload>[] = [
  {
    id: "id",
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
    cell: ({ row }) => {
      const id = row.getValue("id") as string;

      return <div>{`${id.substring(0, 9)}...`}</div>;
    },
  },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },

  {
    id: "description",
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    id: "location",
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Link
        href={row.getValue("location")}
        className="text-blue-500 hover:underline"
      >
        Link
      </Link>
    ),
  },
  {
    id: "image",
    accessorKey: "image",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Image
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      let image = row.getValue("image") as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {image.split("/").pop()?.replaceAll("%20", " ")}
            </TooltipTrigger>
            <TooltipContent className="p-0">
              <Image
                src={image}
                alt="preview"
                width={100}
                height={100}
                unoptimized={image?.endsWith(".gif")}
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "actions",
    enableSorting: false,
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

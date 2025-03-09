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

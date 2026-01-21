"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { Agent } from "@/lib/types/agents";

export const agentColumns: ColumnDef<Agent>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <Link
        href={`/agents/${row.original.id}`}
        className="hover:text-muted-foreground hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
];

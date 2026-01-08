"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { ClubTableRow } from "@/lib/types/clubs";

export const clubColumns: ColumnDef<ClubTableRow>[] = [
  {
    accessorKey: "name",
    header: "Club Name",
    cell: ({ row }) => (
      <Link
        href={`/clubs/${row.original.club_id}`}
        className="hover:text-muted-foreground hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "nation",
    header: "Nation",
    cell: ({ row }) => <div>{row.original.nation}</div>,
  },
];

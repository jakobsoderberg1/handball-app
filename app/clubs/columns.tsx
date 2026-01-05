"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
type Club = {
  club_id: string;
  name: string;
  nation: string;
};

export const clubColumns: ColumnDef<Club>[] = [
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

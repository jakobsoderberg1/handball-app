"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import type { ClubPlayer } from "@/lib/types/clubs";

export const playersColumns: ColumnDef<ClubPlayer>[] = [
  {
    accessorKey: "name",
    header: "Player Name",
    cell: ({ row }) => (
      <Link
        href={`/players/${row.original.id}`}
        className="hover:text-muted-foreground hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "date_of_birth",
    header: "Date of Birth",
    cell: ({ row }) => <div>{row.original.date_of_birth}</div>,
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => <div>{row.original.position}</div>,
  },
  {
    accessorKey: "nation",
    header: "Nation",
    cell: ({ row }) => <div>{row.original.nation}</div>,
  },
];

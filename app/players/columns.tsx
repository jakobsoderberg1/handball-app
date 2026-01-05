"use client";

import { Tables } from "@/lib/supabase/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type Player = {
  user_id: string;
  name: string;
  position: string;
  birth_date: string;
  nationality: string;
  club: string;
  club_id: string;
  contract_expiry?: string;
};

export const playerColumns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/players/${row.original.user_id}`}
        className="hover:text-muted-foreground hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
    cell: ({ row }) => <div>{row.original.nationality}</div>,
  },
  {
    accessorKey: "club",
    header: "Club",
    cell: ({ row }) => (
      <Link
        href={`/clubs/${row.original.club_id}`}
        className="hover:text-muted-foreground hover:underline"
      >
        {row.original.club || "No club"}
      </Link>
    ),
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => <div>{row.original.position}</div>,
  },
  {
    accessorKey: "birth_date",
    header: "Birth Date",
    cell: ({ row }) => <div>{row.original.birth_date}</div>,
  },
  {
    accessorKey: "contract_expiry",
    header: "Contract Expiry",
    cell: ({ row }) => (
      <div>{row.original.contract_expiry || "No contract"}</div>
    ),
  },
];

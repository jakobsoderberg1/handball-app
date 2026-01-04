"use client";

import { Tables } from "@/lib/supabase/types";
import { ColumnDef } from "@tanstack/react-table";

type Player = {
  name: string;
  position: string;
  birth_date: string;
  nationality: string;
  club: string;
  contract_expiry?: string;
};

export const playerColumns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
    cell: ({ row }) => <div>{row.original.nationality}</div>,
  },
  {
    accessorKey: "club",
    header: "Club",
    cell: ({ row }) => <div>{row.original.club || "No club"}</div>,
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

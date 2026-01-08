"use client";
import { useClubs } from "@/lib/hooks/clubs";
import { DataTable } from "@/components/clubs/data-table";
import { clubColumns as columns } from "@/components/clubs/columns";

export default function Page() {
  const { clubs, loading, error } = useClubs();

  return (
    <div className="container mx-auto max-w-screen-lg py-10">
      {loading && <div>Loading clubs...</div>}
      {error && <div>Error loading clubs: {error.message}</div>}
      <DataTable columns={columns} data={clubs} />
    </div>
  );
}

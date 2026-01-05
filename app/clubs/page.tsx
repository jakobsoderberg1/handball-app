import { createClient } from "@/lib/supabase/client";
import { TablesInsert } from "@/lib/supabase/types";
import { DataTable } from "./data-table";
import { clubColumns as columns } from "./columns";
import { cacheTag, cacheLife } from "next/cache";

async function fetchClubs() {
  "use cache";
  cacheTag("clubs-data");
  cacheLife("hours"); // Cache for 60 seconds");
  const supabase = createClient();
  const { data: clubs, error } = await supabase
    .from("clubs")
    .select("id, name, nations(name)")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching clubs:", error);
    return [];
  }
  console.log("Fetched clubs:", clubs);
  // Map clubs to include nation name directly
  const clubsWithNation = clubs.map((club: any) => ({
    club_id: club.club_id,
    name: club.name,
    nation: club.nations?.name || "",
  }));
  console.log("Mapped clubs with nation:", clubsWithNation);
  return clubsWithNation;
}

export default async function Page() {
  const clubs = await fetchClubs();

  return (
    <div className="container mx-auto max-w-screen-lg py-10">
      <DataTable columns={columns} data={clubs} />
    </div>
  );
}

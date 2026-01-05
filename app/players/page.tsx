import { createClient } from "@/lib/supabase/client";
import { TablesInsert } from "@/lib/supabase/types";
import { DataTable } from "./data-table";
import { playerColumns as columns } from "./columns";
import { cacheTag, cacheLife } from "next/cache";

async function fetchPlayers() {
  "use cache";
  cacheTag("players-data");
  cacheLife("hours"); // Cache for 60 seconds");
  const supabase = createClient();
  const { data: players, error } = await supabase
    .from("players")
    .select(
      "*, user_info(name), nations(name), player_club(clubs(name, id), end_date)"
    )
    .order("user_info(name)", { ascending: true });

  if (error) {
    console.error("Error fetching players:", error);
    return [];
  }
  console.log("Fetched players:", players);
  // If no players in the database, return mock data
  const playersWithClubAndNationality = players.map((player: any) => {
    // Find current club (no end_date) or most recent club (latest end_date)
    const currentClub = player.player_club?.find((pc: any) => !pc.end_date);
    const mostRecentClub =
      currentClub ||
      player.player_club?.sort((a: any, b: any) => {
        if (!a.end_date) return -1;
        if (!b.end_date) return 1;
        // Compare date strings directly (ISO format sorts correctly)
        return b.end_date.localeCompare(a.end_date);
      })[0];

    return {
      ...player,
      user_id: player.user_id,
      name: player.user_info?.name || "",
      nationality: player.nations?.name || "",
      club: mostRecentClub?.clubs?.name || "",
      club_id: mostRecentClub?.clubs?.id || "",
      contract_expiry: mostRecentClub?.end_date || null,
    };
  });

  return playersWithClubAndNationality;
}

export default async function Page() {
  const players = await fetchPlayers();

  return (
    <div className="container mx-auto max-w-screen-lg py-10">
      <DataTable columns={columns} data={players} />
    </div>
  );
}

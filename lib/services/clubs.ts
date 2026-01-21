import { SupabaseClient } from "@supabase/supabase-js";
import type { Competition } from "@/lib/types/competitions";

export async function fetchClubs(db: SupabaseClient) {
  const { data: clubs, error } = await db
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
    club_id: club.id,
    name: club.name,
    nation: club.nations?.name || "",
  }));
  console.log("Mapped clubs with nation:", clubsWithNation);
  return clubsWithNation;
}

export async function getClubPlayers(db: SupabaseClient, clubId: string) {
  const { data: players, error } = await db
    .from("players")
    .select("*")
    .eq("club_id", clubId)
    .eq("player_club(is_junior)", "FALSE");

  if (error) throw error;
  return players || [];
}

export async function getClubById(db: SupabaseClient, clubId: string) {
  const { data: club, error } = await db
    .from("clubs")
    .select(
      "id, nation_id, name, nations(name), club_competition(competitions(id, name))",
    )
    .eq("id", clubId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching club by ID:", error);
    return null;
  }
  console.log("Raw club data fetched by ID:", club);
  const mappedClub = club
    ? {
        id: club.id as string,
        nation_id: club.nation_id as string,
        name: club.name as string,
        nation: club.nations[0]?.name || ("" as string),
        competitions: club.club_competition.map((comp: any) => ({
          id: comp.competitions.id,
          name: comp.competitions.name,
        })) as Competition[],
      }
    : null;
  console.log("Fetched club by ID:", mappedClub);
  return mappedClub;
}

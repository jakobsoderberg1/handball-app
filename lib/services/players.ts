import type { SupabaseClient } from "@supabase/supabase-js";
import { Tables } from "@/lib/supabase/types";
import { Player, PlayerClub } from "@/lib/types/players";

export async function getPlayerById(
  db: SupabaseClient,
  targetPlayerId: string
) {
  const { data, error } = await db
    .from("players")
    .select(
      "*, nations(name), player_agent(agents(user_info(name))), player_club(clubs(name, nations(name)), club_id, start_date, end_date)"
    )
    .eq("user_id", targetPlayerId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  let userInfo = data.user_info;
  if (!data.player_agent?.[0]?.agents?.user_info?.name) {
    const { data: userData } = await db
      .from("user_info")
      .select("email, name")
      .eq("user_id", data.user_id)
      .single();

    userInfo = userData ?? userInfo;
  }

  // Transform the data to match PlayerData type
  const playerData: Player = {
    ...data,
    name: userInfo?.name || "Unknown",
    nation: data.nations?.name || "Unknown",
    contact:
      data.player_agent?.agents?.user_info?.name ||
      userInfo?.email ||
      "No contact",
    player_club: (data.player_club || []).map((pc: any) => ({
      clubs: { name: pc.clubs?.name || "Unknown" },
      nationality: pc.clubs?.nations?.name || "Unknown",
      start_date: pc.start_date,
      end_date: pc.end_date,
      club_id: pc.club_id,
    })),
  };
  console.log("Fetched player data:", playerData);
  return playerData;
}

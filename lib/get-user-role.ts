import { createClient } from "@/lib/supabase/server";

export type UserRole = "player" | "agent" | "club_rep" | null;

export async function getUserRole(userId: string): Promise<UserRole> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("user_info")
    .select("role")
    .eq("user_id", userId)
    .single();

  return data?.role || null;
}

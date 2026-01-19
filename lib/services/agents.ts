import { Agent } from "@/lib/types/agents";
import { SupabaseClient } from "@supabase/supabase-js";

export default async function getAllAgents(db: SupabaseClient) {
  const { data, error } = await db
    .from("agents")
    .select("user_id, user_info(name, email)");

  if (error) {
    throw error;
  }

  const agents: Agent[] =
    data?.map((agent) => ({
      user_id: agent.user_id,
      name: agent.user_info.name,
      email: agent.user_info.email,
    })) || [];

  return agents;
}

import { createClient } from "@/lib/supabase/client";

export async function getCurrentUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching auth session:", error);
    return;
  }

  return data.session?.user.id;
}

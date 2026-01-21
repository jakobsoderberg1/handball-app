import { useEffect, useState } from "react";
import { Agent } from "@/lib/types/agents";
import { createClient } from "@/lib/supabase/client";
import getAllAgents from "@/lib/services/agents";

export function useAgents() {
  // Placeholder implementation
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        // Simulate fetching agents
        const db = createClient();
        const agents = await getAllAgents(db);
        if (!cancelled) {
          setAgents(agents);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return { agents, loading, error };
}

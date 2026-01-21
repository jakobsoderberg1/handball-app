import { createClient } from "@/lib/supabase/client";
import { Player } from "@/lib/types/players";
import { useState, useEffect } from "react";
import { getPlayerById } from "../services/players";
import { getCurrentUser } from "../services/users";

type Status = "loading" | "error" | "success" | "not_found";

export function usePlayer(playerId: string) {
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [isUser, setIsUser] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>("loading");
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setStatus("loading");
        setLoadError(null);
        const db = createClient();
        const fetched = await getPlayerById(db, playerId);
        if (cancelled) return;

        if (!fetched) {
          setPlayerData(null);
          setIsUser(false);
          setStatus("not_found");
          return;
        }

        setPlayerData(fetched);
        setStatus("success");

        const currentUserId = await getCurrentUser();
        if (!cancelled) {
          setIsUser(currentUserId === playerId);
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Error in usePlayer hook:", error);
        setLoadError(error as Error);
        setStatus("error");
        setPlayerData(null);
        setIsUser(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [playerId]);

  return { playerData, isUser, status, loadError };
}

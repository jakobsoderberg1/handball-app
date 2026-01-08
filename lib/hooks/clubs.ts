"use client";

import { createClient } from "@/lib/supabase/client";
import { fetchClubs, getClubById, getClubPlayers } from "../services/clubs";
import { useEffect, useState } from "react";
import { Club, ClubTableRow } from "@/lib/types/clubs";
import { Player } from "@/lib/types/players";

export function useClubs() {
  const supabase = createClient();
  const [clubs, setClubs] = useState<ClubTableRow[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const fetchedClubs = await fetchClubs(supabase);
        if (!cancelled) {
          setClubs(fetchedClubs);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          setClubs([]);
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
  }, [supabase]);

  return { clubs, error, loading };
}

export function useSeniorClubPlayers(clubId: string) {
  const supabase = createClient();
  const [seniorPlayers, setSeniorPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const getPlayers = await getClubPlayers(supabase, clubId);

        const data = getPlayers.map((player: any) => ({
          id: player.id,
          user_id: player.user_id,
          nation_id: player.nation_id,
          date_of_birth: player.date_of_birth,
          position: player.position,
          height: player.height_cm,
          weight: player.weight_kg,
          name: player.name,
          contact: player.contact,
          nation: player.nation,
          player_club: player.player_club,
        }));
        if (!cancelled) {
          setSeniorPlayers(data || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          setSeniorPlayers([]);
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
  }, [supabase, clubId]);

  return { seniorPlayers, error, loading };
}

export function useClub(clubId: string) {
  const supabase = createClient();
  const [club, setClub] = useState<Club | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const fetchedClub = await getClubById(supabase, clubId);
        if (!cancelled) {
          setClub(fetchedClub);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          setClub(null);
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
  }, [supabase, clubId]);

  return { club, error, loading };
}

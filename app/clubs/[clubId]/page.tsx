"use client";

import { use } from "react";
import ClubCard from "@/components/clubs/club-card";
import { useClub, useSeniorClubPlayers } from "@/lib/hooks/clubs";
import { Club, ClubPlayer } from "@/lib/types/clubs";

export default function Page({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = use(params);
  const { club, error, loading } = useClub(clubId);
  const { seniorPlayers } = useSeniorClubPlayers(clubId);

  return (
    <ClubCard
      club={club}
      error={error}
      loading={loading}
      seniorPlayers={seniorPlayers}
    />
  );
}

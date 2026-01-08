"use client";

import { use } from "react";
import PlayerCard from "@/components/players/player-card";
import { usePlayer } from "@/lib/hooks/players";

export default function Page({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = use(params);
  const { playerData, isUser, status, loadError } = usePlayer(playerId);

  return (
    <PlayerCard
      player={playerData}
      status={status}
      loadError={loadError}
      isUser={isUser}
    />
  );
}

"use client";
import { use } from "react";
import PlayerEdit from "@/components/players/player-edit-form";
export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  return <PlayerEdit userId={userId} />;
}

"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/types";
import { useCallback, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type PlayerClub = {
  club_id: string; // or string if it truly is text in DB
  nationality: string;
  clubs: { name: string };
  start_date: string | null;
  end_date: string | null;
};

type PlayerData = Tables<"players"> & {
  contact: string;
  nation: string;
  player_club: PlayerClub[];
};

type Agent = {
  id: string;
  name: string;
};

type RawAgent = {
  id: string;
  user_info: Array<{ name: string | null }> | null;
};

type RawPlayerClub = {
  club_id: number;
  start_date: string | null;
  end_date: string | null;
  clubs: {
    name: string | null;
    nations: { name: string | null } | null;
  } | null;
};

export default function PlayerEdit({ userId }: { userId: string }) {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [nations, setNations] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [playerAgent, setPlayerAgent] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  const [isLoadingNations, setIsLoadingNations] = useState(false);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [hasFetchedNations, setHasFetchedNations] = useState(false);
  const [hasFetchedAgents, setHasFetchedAgents] = useState(false);

  const fetchPlayerData = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("players")
      .select(
        "*, nations(name), player_agent(agents(user_info(name))), player_club(clubs(name, nations(name)), club_id, start_date, end_date)"
      )
      .eq("user_id", userId)
      .single();
    if (error) {
      console.error("Error fetching player data:", error);
    } else {
      if (!data.player_agent?.[0]?.agents?.user_info?.name) {
        const { data: userData, error: userError } = await supabase
          .from("user_info")
          .select("email, name")
          .eq("user_id", userId)
          .single();
        if (userError) {
          console.error("Error fetching user info:", userError);
        } else {
          data.user_info = userData;
        }
      }
      // Transform the data to match PlayerData type
      const playerData: PlayerData = {
        ...data,
        name: data.user_info?.name || "Unknown",
        nation: data.nations?.name || "Unknown",
        contact:
          data.player_agent?.[0]?.agents?.user_info?.name ||
          data.user_info?.email ||
          "No contact",
        player_club: (((data.player_club ?? []) as RawPlayerClub[]) || []).map(
          (pc) => ({
            clubs: { name: pc.clubs?.name || "Unknown" },
            nationality: pc.clubs?.nations?.name || "Unknown",
            start_date: pc.start_date,
            end_date: pc.end_date,
            club_id: pc.club_id,
          })
        ),
      };
      console.log("Fetched player data:", playerData);
      setPlayer(playerData);
    }
  }, [userId]);
  const fetchNations = async () => {
    if (isLoadingNations || hasFetchedNations) return;
    setIsLoadingNations(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("nations")
      .select("id, name")
      .order("name", { ascending: true });
    if (error) {
      console.error("Error fetching nations:", error);
    } else {
      setNations(data || []);
      setHasFetchedNations(true);
    }

    setIsLoadingNations(false);
  };

  const getAgents = async () => {
    if (isLoadingAgents || hasFetchedAgents) return;
    setIsLoadingAgents(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("agents")
      .select("id, user_info(name)")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching agent:", error);
    } else {
      const mappedAgents: Agent[] = ((data ?? []) as RawAgent[]).map((row) => ({
        id: row.id,
        name: row.user_info?.[0]?.name ?? "Unknown",
      }));

      setAgents(mappedAgents);
      setHasFetchedAgents(true);
    }

    setIsLoadingAgents(false);
  };
  useEffect(() => {
    fetchPlayerData();
  }, [fetchPlayerData]);

  const positions = [
    { name: "Goalkeeper", abbr: "GK" },
    { name: "Left Wing", abbr: "LW" },
    { name: "Right Wing", abbr: "RW" },
    { name: "Pivot", abbr: "P" },
    { name: "Left Back", abbr: "LB" },
    { name: "Center Back", abbr: "CB" },
    { name: "Right Back", abbr: "RB" },
    { name: "Defender", abbr: "D" },
  ];

  return (
    <div className="flex items-center justify-center p-12">
      {player ? (
        <Card className="min-w-[36rem] flex flex-col gap-6 p-6">
          <CardTitle className="text-2xl font-bold mb-4">
            {player.name}
          </CardTitle>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="country">Nationality</Label>
              <Select
                value={player.nation}
                onValueChange={(value) =>
                  setPlayer({ ...player, nation: value })
                }
                onOpenChange={(open) => {
                  if (open) fetchNations();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {nations.map((nation) => (
                    <SelectItem key={nation.id} value={nation.name}>
                      {nation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="height" className="mt-4">
                Height (cm)
              </Label>
              <Input
                id="height"
                type="number"
                value={player.height || ""}
                onChange={(e) =>
                  setPlayer({ ...player, height: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight" className="mt-4">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={player.weight || ""}
                onChange={(e) =>
                  setPlayer({ ...player, weight: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={player.position || ""}
                onValueChange={(value) =>
                  setPlayer({ ...player, position: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.abbr} value={pos.name}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent" className="mt-4">
                Agent (optional)
              </Label>
              <Select
                value={playerAgent || ""}
                onValueChange={(value) => setPlayerAgent(value)}
                onOpenChange={(open) => {
                  if (open) getAgents();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator className="my-4" />
            <h2 className="text-xl font-semibold mb-2">Club History</h2>
            {player.player_club.length > 0 ? (
              <ItemGroup>
                {player.player_club.map((pc, index) => (
                  <Item key={index} variant="outline" size="sm">
                    <ItemContent className="flex flex-col justify-center my-auto">
                      <ItemTitle>
                        <span className="flex items-center gap-1">
                          <strong>
                            <a
                              className="hover:underline"
                              href={`/club/${pc.club_id}`}
                            >
                              {pc.clubs.name}
                            </a>
                          </strong>
                          <span className="text-muted-foreground">
                            – {pc.nationality}
                          </span>
                        </span>
                      </ItemTitle>

                      <div className="text-sm text-muted-foreground">
                        {pc.start_date} - {pc.end_date || "Present"}
                      </div>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            ) : (
              <p>No club history available.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <p>Loading player data...</p>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/types";
import { use, useEffect, useState } from "react";

type PlayerClub = {
  club_id: number; // or string if it truly is text in DB
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

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [isUser, setIsUser] = useState<boolean>(false);

  const checkCurrentUser = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
    if (data?.user?.id === userId) {
      setIsUser(true);
    }
  };
  const fetchPlayerData = async () => {
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
      if (!data.player_agent.name) {
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
          data.player_agent?.[0]?.agents?.name ||
          data.user_info?.email ||
          "No contact",
        player_club: (data.player_club || []).map((pc: any) => ({
          clubs: { name: pc.clubs?.name || "Unknown" },
          nationality: pc.clubs?.nations?.name || "Unknown",
          start_date: pc.start_date,
          end_date: pc.end_date,
          club_id: pc.club_id,
        })),
      };
      console.log("Fetched player data:", playerData);
      setPlayer(playerData);
    }
  };

  useEffect(() => {
    fetchPlayerData();
    checkCurrentUser();
  }, [userId]);

  return (
    <div className="flex items-center justify-center p-12">
      {player ? (
        <Card className="min-w-[36rem] flex flex-col gap-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl font-bold">{player.name}</CardTitle>
            {isUser && (
              <Button
                className="mr-6 dark:bg-gray-200"
                size="sm"
                onClick={() =>
                  (window.location.href = `/protected/player/${player.user_id}`)
                }
              >
                Edit Profile
              </Button>
            )}
          </div>
          <CardContent>
            <p className="mt-2">Position: {player.position}</p>
            <p className="mt-2">Nationality: {player.nation}</p>
            <p className="mt-2">Height: {player.height} cm</p>
            <p className="mt-2">Weight: {player.weight} kg</p>
            <p className="mt-2">
              Contact:{" "}
              <a className="hover:underline" href={`mailto:${player.contact}`}>
                {player.contact}
              </a>
            </p>
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
                              href={`/clubs/${pc.club_id}`}
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

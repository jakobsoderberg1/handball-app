import { PlayerCardProps } from "@/lib/types/components";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemContent, ItemGroup, ItemTitle } from "../ui/item";

export default function PlayerCard({
  status,
  loadError,
  player,
  isUser,
}: PlayerCardProps) {
  return (
    <div className="flex items-center justify-center p-12">
      {status === "loading" ? (
        <p>Loading player data...</p>
      ) : status === "error" ? (
        <p>Failed to load player: {loadError?.message || "Unknown error"}</p>
      ) : !player ? (
        <p>Player not found.</p>
      ) : (
        <Card className="min-w-[36rem] flex flex-col gap-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl font-bold">{player.name}</CardTitle>
            {isUser && (
              <Button
                className="mr-6 bg-sky-700 hover:bg-sky-800"
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
                              {pc.club_name}
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
      )}
    </div>
  );
}

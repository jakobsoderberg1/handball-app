"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createClient } from "@/lib/supabase/client";
import { Checkbox } from "../ui/checkbox";
import { TablesInsert } from "@/lib/supabase/types";

type PlayerClub = TablesInsert<"player_club">;
type Agent = TablesInsert<"agents">;
type Nation = TablesInsert<"nations">;
type Club = TablesInsert<"clubs">;

type PlayerClubWithUI = PlayerClub & {
  clubCountry: string | null;
  openStartDate: boolean;
  openEndDate: boolean;
};

export default function PlayerSignUpForm({
  userId,
}: {
  userId: string | null;
}) {
  const [name, setName] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [agent, setAgent] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [nations, setNations] = useState<Nation[]>([]);
  const [country, setCountry] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  const [clubs, setClubs] = useState<Club[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playerClubs, setPlayerClubs] = useState<PlayerClubWithUI[]>([
    {
      clubCountry: null,
      club_id: undefined,
      start_date: undefined,
      end_date: undefined,
      is_current: false,
      player_id: undefined,
      openStartDate: false,
      openEndDate: false,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const getClubs = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("clubs").select("*");
    if (error) {
      setError(error.message);
      return;
    }
    if (data) {
      setClubs(data);
    }
  };

  const getAgents = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("agents").select("*");
    if (error) {
      setError(error.message);
      return;
    }
    if (data) {
      setAgents(data);
    }
  };

  const getNations = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from("nations").select("*");
    if (error) {
      setError(error.message);
      return;
    }
    if (data) {
      setNations(data);
    }
  };

  useEffect(() => {
    getAgents();
    getNations();
    getClubs();
  }, []);

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

  const handleRegisterPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: playerData, error: insertError } = await supabase
        .from("players")
        .insert({
          user_id: userId,
          nation_id: country,
          birth_date: birthDate ? birthDate.toISOString().split("T")[0] : null,
          height,
          weight,
          position,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!playerData) throw new Error("Failed to create player");

      const playerId = playerData.id;

      // Insert player agent if selected
      if (agent && agent !== "none") {
        const { error: agentInsertError } = await supabase
          .from("player_agent")
          .insert({
            player_id: playerId,
            agent_id: agent,
          });
        if (agentInsertError) throw agentInsertError;
      }

      // Insert player clubs
      for (const club of playerClubs) {
        if (club.club_id) {
          const { error: clubError } = await supabase
            .from("player_club")
            .insert({
              player_id: playerId,
              club_id: club.club_id,
              start_date: club.start_date,
              end_date: club.end_date,
              junior: club.junior || false,
            });
          if (clubError) throw clubError;
        }
      }

      // Registration successful
      alert("Player registered successfully!");
      window.location.href = "/protected";
    } catch (error: unknown) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null
          ? JSON.stringify(error)
          : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
      <Card className="w-full min-w-[32rem]">
        <CardHeader>
          <CardTitle className="text-2xl">Register Player</CardTitle>
          <CardDescription>
            Input your information to complete your registration as a player.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterPlayer}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="country">Nationality</Label>
                <Select value={country || undefined} onValueChange={setCountry}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {nations.map((nation) => (
                      <SelectItem key={nation.id} value={nation.id!}>
                        {nation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="birth-date" className="px-1">
                  Date of birth
                </Label>
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="birth-date"
                      className="w-full justify-between font-normal"
                    >
                      {birthDate
                        ? birthDate.toLocaleDateString()
                        : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="overflow-hidden p-0"
                    align="start"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                  >
                    <Calendar
                      mode="single"
                      className="w-full"
                      selected={birthDate}
                      captionLayout="dropdown"
                      onSelect={(d) => {
                        setBirthDate(d);
                        setOpenDate(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="180"
                  required
                  value={height ?? ""}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="75"
                  required
                  value={weight ?? ""}
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={position || undefined}
                  onValueChange={setPosition}
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
                <Label htmlFor="clubs">Agent</Label>
                <Select value={agent || undefined} onValueChange={setAgent}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No agent</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id!}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="previous-clubs">Previous Clubs</Label>
                {playerClubs.map((club, index) => (
                  <Card key={index}>
                    <CardContent className="relative">
                      {playerClubs.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-2"
                          onClick={() => {
                            const newClubs = playerClubs.filter(
                              (_, i) => i !== index
                            );
                            setPlayerClubs(newClubs);
                          }}
                        >
                          ✕
                        </Button>
                      )}
                      <div className="mt-2">
                        <Label
                          htmlFor={`club-country-${index}`}
                          className="text-xs mb-2"
                        >
                          Club Country
                        </Label>
                        <Select
                          value={club.clubCountry || undefined}
                          onValueChange={(value) => {
                            const newClubs = [...playerClubs];
                            newClubs[index].clubCountry = value;
                            setPlayerClubs(newClubs);
                          }}
                        >
                          <SelectTrigger className="w-full mt-4">
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {nations.map((nation) => (
                              <SelectItem key={nation.id} value={nation.id!}>
                                {nation.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Select
                        value={club.club_id || undefined}
                        onValueChange={(value) => {
                          const newClubs = [...playerClubs];
                          newClubs[index].club_id = value;
                          setPlayerClubs(newClubs);
                        }}
                      >
                        <SelectTrigger className="w-full mt-4">
                          <SelectValue placeholder="Select Previous Club" />
                        </SelectTrigger>
                        <SelectContent>
                          {clubs
                            ?.filter(
                              (c) =>
                                !club.clubCountry ||
                                c.nation_id === club.clubCountry
                            )
                            .map((c) => (
                              <SelectItem key={c.id} value={c.id!}>
                                {c.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-4 flex">
                        <Label
                          htmlFor={`start-date-${index}`}
                          className="px-4 text-xs my-auto "
                        >
                          Start
                        </Label>
                        <Popover
                          open={club.openStartDate}
                          onOpenChange={(open) => {
                            const newClubs = [...playerClubs];
                            newClubs[index].openStartDate = open;
                            setPlayerClubs(newClubs);
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id={`start-date-${index}`}
                              className="w-1/3 justify-between font-normal"
                            >
                              {club.start_date
                                ? new Date(club.start_date).toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="overflow-hidden p-0"
                            align="start"
                            style={{
                              width: "var(--radix-popover-trigger-width)",
                            }}
                          >
                            <Calendar
                              mode="single"
                              className="w-full"
                              selected={
                                club.start_date
                                  ? new Date(club.start_date)
                                  : undefined
                              }
                              captionLayout="dropdown"
                              onSelect={(d) => {
                                const newClubs = [...playerClubs];
                                newClubs[index].start_date = d
                                  ? d.toISOString().split("T")[0]
                                  : undefined;
                                newClubs[index].openStartDate = false;
                                setPlayerClubs(newClubs);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <Label
                          htmlFor={`end-date-${index}`}
                          className="px-4 text-xs my-auto "
                        >
                          End
                        </Label>
                        <Popover
                          open={club.openEndDate}
                          onOpenChange={(open) => {
                            const newClubs = [...playerClubs];
                            newClubs[index].openEndDate = open;
                            setPlayerClubs(newClubs);
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id={`end-date-${index}`}
                              className="w-1/3 justify-between font-normal"
                            >
                              {club.end_date
                                ? new Date(club.end_date).toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="overflow-hidden p-0"
                            align="start"
                            style={{
                              width: "var(--radix-popover-trigger-width)",
                            }}
                          >
                            <Calendar
                              mode="single"
                              className="w-full"
                              selected={
                                club.end_date
                                  ? new Date(club.end_date)
                                  : undefined
                              }
                              captionLayout="dropdown"
                              onSelect={(d) => {
                                const newClubs = [...playerClubs];
                                newClubs[index].end_date = d
                                  ? d.toISOString().split("T")[0]
                                  : undefined;
                                newClubs[index].openEndDate = false;
                                setPlayerClubs(newClubs);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center space-x-2 ml-2 mt-4">
                        <Checkbox
                          id={`current-${index}`}
                          checked={club.junior || false}
                          onCheckedChange={(checked) => {
                            const newClubs = [...playerClubs];
                            newClubs[index].junior = checked === true;
                            setPlayerClubs(newClubs);
                          }}
                        />
                        <Label htmlFor={`current-${index}`} className="text-sm">
                          Junior Club
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPlayerClubs([
                      ...playerClubs,
                      {
                        clubCountry: null,
                        club_id: undefined,
                        start_date: undefined,
                        end_date: undefined,
                        is_current: false,
                        player_id: undefined,
                        openStartDate: false,
                        openEndDate: false,
                      },
                    ]);
                  }}
                >
                  Add club
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register Player"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

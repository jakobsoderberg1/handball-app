import type { Player } from "@/lib/types/players";
import type { ClubCardProps } from "@/lib/types/components";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { PlayerTable } from "./players-table";
import { playersColumns as columns } from "./players-columns";
import Link from "next/link";

export default function ClubCard({
  club,
  error,
  loading,
  seniorPlayers,
}: ClubCardProps) {
  return (
    <div className="flex items-center justify-center p-4 sm:p-12">
      {loading ? (
        <p>Loading club data...</p>
      ) : error ? (
        <p>Failed to load club: {error?.message || "Unknown error"}</p>
      ) : !club ? (
        <p>Club not found.</p>
      ) : (
        <Card className="w-full max-w-3xl flex flex-col gap-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl font-bold">{club.name}</CardTitle>
          </div>
          <CardContent>
            <p className="mt-2">Nationality: {club.nation}</p>
            <p className="mt-2">Competing in:</p>
            <ul className="list-none list-inside">
              {(club.competitions ?? []).map((competition) => (
                <li className="ml-4 mt-2" key={competition.id}>
                  <Link
                    className="text-sky-700 hover:underline hover:text-sky-900"
                    href={`/competitions/${competition.id}`}
                  >
                    {competition.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <PlayerTable columns={columns} data={seniorPlayers as Player[]} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

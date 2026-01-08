import { Player } from "./players";
import { Club, ClubPlayer } from "./clubs";

export type PlayerCardProps = {
  status: "loading" | "error" | "success" | "not_found";
  loadError: Error | null;
  player?: Player | null;
  isUser: boolean;
};

export type ClubCardProps = {
  club: Club | null;
  error: Error | null;
  loading: boolean;
  seniorPlayers: ClubPlayer[];
};

export type PlayerClub = {
  club_id: number; // Club id (DB type)
  nationality: string;
  clubs: { name: string };
  start_date: string | null;
  end_date: string | null;
};

export type Player = {
  id: string; // Player id (DB type)
  user_id: string; // User id (DB type)
  nation_id: number | null; // Nation id (DB type)
  date_of_birth: string | null;
  position: string | null;
  height: number | null;
  weight: number | null;
  name: string;
  contact: string | null;
  nation: string;
  player_club: PlayerClub[];
};

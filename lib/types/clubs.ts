import { Competition } from "./competitions";

export type ClubTableRow = {
  club_id: string;
  name: string;
  nation: string;
};

export type Club = {
  id: string; // Club id (DB type)
  name: string;
  nation_id: string;
  nation: string;
  competitions: Competition[];
};

export type ClubPlayer = {
  id: string; // Player id (DB type)
  name: string;
  position: string | null;
  date_of_birth: string | null;
  nation: string;
};

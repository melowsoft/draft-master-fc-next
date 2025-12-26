// types.ts
export type Position = 'GKP' | 'DEF' | 'MID' | 'FWD';
export type PlayerRole = 'C' | 'V' | undefined;

export interface FormationPosition {
  id: string;
  x: number;
  y: number;
  position: Position;
}

export interface Formation {
  id: string;
  name: string;
  positions: FormationPosition[];
  description: string;
}

export interface Player {
  id: string;
  name: string;
  club: string;
  x: number;
  y: number;
  role?: 'C' | 'V';
  color: string; // Single color now
  position: 'GKP' | 'DEF' | 'MID' | 'FWD';
  showName?: boolean;
  showClub?: boolean;
}


export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Round {
  id: string;
  name: string;
  scores: Record<string, number>; // teamId -> score
}

export interface Competition {
  id: string;
  title: string;
  teams: Team[];
  rounds: Round[];
  isFinished: boolean;
  createdAt: number;
}

export type View = 'HOME' | 'SETUP' | 'SCORING' | 'SUMMARY';

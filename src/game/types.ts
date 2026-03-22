export interface Relic {
  id: string;
  name: string;
  saintId: string;
  saintName: string;
  relicClass: 1 | 2 | 3;
  provenance: string;
  partIndex: number;
}

export interface Lot {
  id: string;
  relic: Relic;
  currentBid: number;
  yourBid: number | null;
  bidCount: number;
  timeRemaining: number; // seconds
  totalTime: number;
  status: 'active' | 'closing' | 'closed' | 'won' | 'lost';
  weight: number; // for grid sizing
  flash: 'outbid' | 'win' | null;
  flashUntil: number;
  sniped: boolean; // true after snipe extension applied (once per lot)
}

export interface Saint {
  id: string;
  name: string;
  totalRelics: number;
  collectedRelics: string[]; // relic names
}

export interface GameState {
  currency: number;
  lots: Lot[];
  saints: Saint[];
  completedSaint: string | null; // saint name, shown briefly
  lotCounter: number;
}

export interface BSPNode {
  x: number;
  y: number;
  w: number;
  h: number;
  lotId?: string;
  children?: [BSPNode, BSPNode];
}

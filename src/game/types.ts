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
  bidderName: string | null; // name of AI bidder currently leading
}

export interface CollectedRelic {
  name: string;
  id: string;
}

export interface Saint {
  id: string;
  name: string;
  totalRelics: number;
  collectedRelics: CollectedRelic[];
}

export interface PortfolioItem {
  relic: Relic;
  purchasePrice: number;
  acquiredAt: number;
  marketPrice: number;
}

export interface Headline {
  id: number;
  type: 'commission' | 'suppress' | 'fabrication' | 'heresy';
  saintId: string;
  saintName: string;
  title: string;
  sentimentDelta: number;
  ticksRemaining: number;
  collapseChance: number; // only for fabrications, starts at 0.02
}

export interface GameOverStats {
  reason: 'bankrupt' | 'victory';
  netWorth: number;
  saintsCompleted: number;
  relicsCollected: number;
  timePlayed: number;
}

export interface GameState {
  currency: number;
  lots: Lot[];
  saints: Saint[];
  portfolio: PortfolioItem[];
  market: import('./pricing').MarketState;
  completedSaint: string | null; // saint name, shown briefly
  lotCounter: number;
  gameOver: GameOverStats | null;
  pendingMessages: string[];
  aiBidders: import('./aiBidders').AIBidder[];
  activeHeadlines: Headline[];
  headlineCounter: number;
}

export interface BSPNode {
  x: number;
  y: number;
  w: number;
  h: number;
  lotId?: string;
  children?: [BSPNode, BSPNode];
}

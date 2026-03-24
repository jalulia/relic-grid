import { Lot } from './types';
import { MarketState } from './pricing';

export interface AIBidder {
  id: string;
  name: string;
  budget: number;
  maxBudget: number;
  targetSaints: string[];
  bidStyle: 'sniper' | 'completionist' | 'steady' | 'speculator' | 'panic';
  aggression: number;
  preferredClasses: number[];
  sentimentWeight: number;
}

export function createBidders(): AIBidder[] {
  return [
    {
      id: 'borgia',
      name: 'BORGIA',
      budget: 2000,
      maxBudget: 2000,
      targetSaints: [],
      bidStyle: 'sniper',
      aggression: 0.8,
      preferredClasses: [1],
      sentimentWeight: 0.3,
    },
    {
      id: 'caecilia',
      name: 'MOTHER CAECILIA',
      budget: 1800,
      maxBudget: 1800,
      targetSaints: ['lucia', 'agatha', 'catherine'],
      bidStyle: 'completionist',
      aggression: 0.5,
      preferredClasses: [],
      sentimentWeight: 0.5,
    },
    {
      id: 'aldric',
      name: 'BROTHER ALDRIC',
      budget: 2500,
      maxBudget: 2500,
      targetSaints: [],
      bidStyle: 'steady',
      aggression: 0.3,
      preferredClasses: [],
      sentimentWeight: 0.4,
    },
    {
      id: 'collector',
      name: 'THE COLLECTOR',
      budget: 1500,
      maxBudget: 1500,
      targetSaints: [],
      bidStyle: 'speculator',
      aggression: 0.2,
      preferredClasses: [],
      sentimentWeight: 0.2,
    },
    {
      id: 'rufus',
      name: 'CARDINAL RUFUS',
      budget: 1200,
      maxBudget: 1200,
      targetSaints: [],
      bidStyle: 'panic',
      aggression: 0.6,
      preferredClasses: [],
      sentimentWeight: 0.9,
    },
  ];
}

interface BidResult {
  lot: Lot;
  bidderName: string;
  amount: number;
}

export function evaluateBidderBid(
  bidder: AIBidder,
  lot: Lot,
  market: MarketState,
): BidResult | null {
  if (lot.status !== 'active' && lot.status !== 'closing') return null;
  if (lot.timeRemaining <= 0) return null;
  if (bidder.budget <= 0) return null;

  const sentiment = market.sentiment[lot.relic.saintId] ?? 0;
  const sentimentMod = 1 + bidder.sentimentWeight * sentiment;

  switch (bidder.bidStyle) {
    case 'sniper': {
      // Only bids in final 10 seconds, large bids
      if (lot.timeRemaining > 10) return null;
      if (bidder.preferredClasses.length > 0 && !bidder.preferredClasses.includes(lot.relic.relicClass)) return null;
      const chance = 0.15 * bidder.aggression * sentimentMod;
      if (Math.random() > chance) return null;
      const pct = 0.25 + Math.random() * 0.10; // 25-35% over
      const amount = Math.ceil(lot.currentBid * (1 + pct));
      if (amount > bidder.budget) return null;
      return { lot, bidderName: bidder.name, amount };
    }

    case 'completionist': {
      // Targets specific saints, pays premiums
      if (bidder.targetSaints.length > 0 && !bidder.targetSaints.includes(lot.relic.saintId)) {
        if (Math.random() > 0.05) return null; // Rarely bids outside targets
      }
      if (lot.timeRemaining > 30) return null;
      const chance = 0.08 * bidder.aggression * sentimentMod;
      if (Math.random() > chance) return null;
      const pct = 0.10 + Math.random() * 0.10; // 10-20% over
      const amount = Math.ceil(lot.currentBid * (1 + pct));
      if (amount > bidder.budget) return null;
      return { lot, bidderName: bidder.name, amount };
    }

    case 'steady': {
      // Bids throughout lifecycle, small increments
      if (lot.timeRemaining > 30 && lot.relic.relicClass !== 1) return null;
      const chance = (lot.timeRemaining < 15 ? 0.06 : 0.03) * bidder.aggression * sentimentMod;
      if (Math.random() > chance) return null;
      const pct = 0.05 + Math.random() * 0.05; // 5-10% over
      const amount = Math.ceil(lot.currentBid * (1 + pct));
      if (amount > bidder.budget) return null;
      return { lot, bidderName: bidder.name, amount };
    }

    case 'speculator': {
      // Buys undervalued lots, avoids bidding wars
      if (lot.currentBid > 80) return null;
      if (lot.bidCount > 3) return null;
      if (lot.timeRemaining > 45) return null;
      const chance = 0.10 * bidder.aggression * Math.max(0.5, sentimentMod);
      if (Math.random() > chance) return null;
      const pct = 0.05 + Math.random() * 0.08;
      const amount = Math.ceil(lot.currentBid * (1 + pct));
      if (amount > bidder.budget) return null;
      return { lot, bidderName: bidder.name, amount };
    }

    case 'panic': {
      // Rare large bids, triggered by outbid or sentiment swings
      if (lot.timeRemaining > 20) return null;
      const isHighSentiment = Math.abs(sentiment) > 0.3;
      const chance = (isHighSentiment ? 0.12 : 0.04) * bidder.aggression * Math.max(0.3, sentimentMod);
      if (Math.random() > chance) return null;
      const pct = 0.40 + Math.random() * 0.20; // 40-60% over
      const amount = Math.ceil(lot.currentBid * (1 + pct));
      if (amount > bidder.budget) return null;
      return { lot, bidderName: bidder.name, amount };
    }

    default:
      return null;
  }
}

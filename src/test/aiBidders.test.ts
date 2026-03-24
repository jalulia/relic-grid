import { describe, it, expect } from 'vitest';
import { createBidders, evaluateBidderBid } from '../game/aiBidders';
import { Lot } from '../game/types';
import { initMarket } from '../game/pricing';

function makeLot(overrides: Partial<Lot> = {}): Lot {
  return {
    id: 'LOT-0001',
    relic: {
      id: 'ambrose-0',
      name: 'Test Relic',
      saintId: 'ambrose',
      saintName: 'AMBROSE',
      relicClass: 1,
      provenance: 'Test',
      partIndex: 0,
    },
    currentBid: 100,
    yourBid: null,
    bidCount: 1,
    timeRemaining: 20,
    totalTime: 60,
    status: 'active',
    weight: 1,
    flash: null,
    flashUntil: 0,
    bidderName: null,
    ...overrides,
  };
}

describe('createBidders', () => {
  it('creates 5 bidders', () => {
    const bidders = createBidders();
    expect(bidders).toHaveLength(5);
  });

  it('each bidder has required fields', () => {
    const bidders = createBidders();
    bidders.forEach(b => {
      expect(b.id).toBeTruthy();
      expect(b.name).toBeTruthy();
      expect(b.budget).toBeGreaterThan(0);
      expect(b.maxBudget).toBe(b.budget);
      expect(typeof b.sentimentWeight).toBe('number');
    });
  });
});

describe('evaluateBidderBid', () => {
  const market = initMarket();

  it('BORGIA only bids in final 10 seconds', () => {
    const borgia = createBidders().find(b => b.id === 'borgia')!;
    const lot20s = makeLot({ timeRemaining: 20 });
    // Run many times - should never bid at 20s
    let bidAt20 = false;
    for (let i = 0; i < 100; i++) {
      if (evaluateBidderBid(borgia, lot20s, market)) { bidAt20 = true; break; }
    }
    expect(bidAt20).toBe(false);

    // But should sometimes bid at 8s
    const lot8s = makeLot({ timeRemaining: 8 });
    let bidAt8 = false;
    for (let i = 0; i < 100; i++) {
      if (evaluateBidderBid(borgia, lot8s, market)) { bidAt8 = true; break; }
    }
    expect(bidAt8).toBe(true);
  });

  it('THE COLLECTOR avoids lots with high bid counts', () => {
    const collector = createBidders().find(b => b.id === 'collector')!;
    const hotLot = makeLot({ bidCount: 5, currentBid: 50, timeRemaining: 30 });
    let bidOnHot = false;
    for (let i = 0; i < 100; i++) {
      if (evaluateBidderBid(collector, hotLot, market)) { bidOnHot = true; break; }
    }
    expect(bidOnHot).toBe(false);
  });

  it('THE COLLECTOR avoids expensive lots', () => {
    const collector = createBidders().find(b => b.id === 'collector')!;
    const expensiveLot = makeLot({ currentBid: 200, timeRemaining: 30 });
    let bid = false;
    for (let i = 0; i < 100; i++) {
      if (evaluateBidderBid(collector, expensiveLot, market)) { bid = true; break; }
    }
    expect(bid).toBe(false);
  });

  it('does not bid on closed lots', () => {
    const bidders = createBidders();
    const closedLot = makeLot({ status: 'closed' });
    bidders.forEach(b => {
      expect(evaluateBidderBid(b, closedLot, market)).toBeNull();
    });
  });

  it('does not bid when budget is 0', () => {
    const borgia = { ...createBidders().find(b => b.id === 'borgia')!, budget: 0 };
    const lot = makeLot({ timeRemaining: 5 });
    expect(evaluateBidderBid(borgia, lot, market)).toBeNull();
  });

  it('bid amount never exceeds bidder budget', () => {
    const bidders = createBidders();
    const lot = makeLot({ timeRemaining: 5, currentBid: 50 });
    bidders.forEach(b => {
      for (let i = 0; i < 50; i++) {
        const result = evaluateBidderBid(b, lot, market);
        if (result) {
          expect(result.amount).toBeLessThanOrEqual(b.budget);
        }
      }
    });
  });
});

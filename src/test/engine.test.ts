import { describe, it, expect } from 'vitest';
import { initGame, placeBid, tick, spawnLot, aiBids, sellRelic, enshrineRelic } from '../game/engine';
import { GameState } from '../game/types';

describe('initGame', () => {
  it('initializes with correct starting state', () => {
    const state = initGame();
    expect(state.currency).toBe(3000);
    expect(state.portfolio).toEqual([]);
    expect(state.completedSaint).toBeNull();
    expect(state.saints).toHaveLength(8);
    expect(state.lotCounter).toBe(12);
  });

  it('creates initial lots', () => {
    const state = initGame();
    expect(state.lots.length).toBeGreaterThan(0);
    expect(state.lots.length).toBeLessThanOrEqual(12);
    state.lots.forEach(lot => {
      expect(lot.status).toBe('active');
      expect(lot.currentBid).toBeGreaterThanOrEqual(15);
      expect(lot.currentBid).toBeLessThanOrEqual(150);
      expect(lot.timeRemaining).toBeGreaterThanOrEqual(30);
      expect(lot.timeRemaining).toBeLessThanOrEqual(90);
    });
  });

  it('initializes saints with zero collected relics', () => {
    const state = initGame();
    state.saints.forEach(saint => {
      expect(saint.collectedRelics).toEqual([]);
      expect(saint.totalRelics).toBeGreaterThan(0);
    });
  });

  it('initializes market state', () => {
    const state = initGame();
    expect(state.market).toBeDefined();
    expect(state.market.globalTemp).toBe(1.0);
    expect(state.market.activeEvents).toEqual([]);
  });
});

describe('placeBid', () => {
  let state: GameState;

  beforeEach(() => {
    state = initGame();
  });

  it('updates lot when bid is valid', () => {
    const lot = state.lots[0];
    const bidAmount = lot.currentBid + 10;
    const newState = placeBid(state, lot.id, bidAmount);
    const updatedLot = newState.lots.find(l => l.id === lot.id)!;
    expect(updatedLot.currentBid).toBe(bidAmount);
    expect(updatedLot.yourBid).toBe(bidAmount);
    expect(updatedLot.bidCount).toBe(lot.bidCount + 1);
  });

  it('rejects bid at or below current bid', () => {
    const lot = state.lots[0];
    const result = placeBid(state, lot.id, lot.currentBid);
    expect(result).toBe(state);
  });

  it('rejects bid exceeding currency', () => {
    const lot = state.lots[0];
    const result = placeBid(state, lot.id, state.currency + 1);
    expect(result).toBe(state);
  });

  it('rejects bid on non-existent lot', () => {
    const result = placeBid(state, 'LOT-9999', 100);
    expect(result).toBe(state);
  });

  it('rejects bid on non-active lot', () => {
    // Manually close a lot
    state = { ...state, lots: state.lots.map((l, i) => i === 0 ? { ...l, status: 'closed' as const } : l) };
    const result = placeBid(state, state.lots[0].id, state.lots[0].currentBid + 10);
    expect(result).toBe(state);
  });
});

describe('tick', () => {
  it('decrements timeRemaining on active lots', () => {
    const state = initGame();
    const now = Date.now();
    const newState = tick(state, now);
    newState.lots.forEach((lot, i) => {
      if (state.lots[i].status === 'active') {
        expect(lot.timeRemaining).toBe(state.lots[i].timeRemaining - 1);
      }
    });
  });

  it('marks lot as won when timer expires with winning bid', () => {
    let state = initGame();
    const lot = state.lots[0];
    // Place a bid
    state = placeBid(state, lot.id, lot.currentBid + 10);
    // Set timer to 1 so next tick expires it
    state = {
      ...state,
      lots: state.lots.map(l => l.id === lot.id ? { ...l, timeRemaining: 1 } : l),
    };
    const newState = tick(state, Date.now());
    const wonLot = newState.lots.find(l => l.id === lot.id)!;
    expect(wonLot.status).toBe('won');
  });

  it('deducts currency when lot is won', () => {
    let state = initGame();
    const lot = state.lots[0];
    const bidAmount = lot.currentBid + 10;
    state = placeBid(state, lot.id, bidAmount);
    state = {
      ...state,
      lots: state.lots.map(l => l.id === lot.id ? { ...l, timeRemaining: 1 } : l),
    };
    const newState = tick(state, Date.now());
    expect(newState.currency).toBe(3000 - bidAmount);
  });

  it('adds won relic to portfolio', () => {
    let state = initGame();
    const lot = state.lots[0];
    state = placeBid(state, lot.id, lot.currentBid + 10);
    state = {
      ...state,
      lots: state.lots.map(l => l.id === lot.id ? { ...l, timeRemaining: 1 } : l),
    };
    const newState = tick(state, Date.now());
    expect(newState.portfolio).toHaveLength(1);
    expect(newState.portfolio[0].relic.id).toBe(lot.relic.id);
  });

  it('marks lot as closed when timer expires with no bid', () => {
    let state = initGame();
    const lot = state.lots[0];
    // No bid placed, set timer to expire
    state = {
      ...state,
      lots: state.lots.map(l => l.id === lot.id ? { ...l, timeRemaining: 1, yourBid: null } : l),
    };
    const newState = tick(state, Date.now());
    const closedLot = newState.lots.find(l => l.id === lot.id)!;
    expect(closedLot.status).toBe('closed');
  });
});

describe('spawnLot', () => {
  it('adds a new lot', () => {
    const state = initGame();
    const newState = spawnLot(state);
    expect(newState.lots.length).toBe(state.lots.length + 1);
    expect(newState.lotCounter).toBe(state.lotCounter + 1);
  });

  it('respects MAX_LOTS cap', () => {
    let state = initGame();
    // Fill to 20 lots
    for (let i = 0; i < 20; i++) {
      state = spawnLot(state);
    }
    const activeLots = state.lots.filter(l => l.status === 'active').length;
    const result = spawnLot(state);
    if (activeLots >= 20) {
      expect(result.lots.length).toBe(state.lots.length);
    }
  });
});

describe('aiBids', () => {
  it('does not modify non-active lots', () => {
    let state = initGame();
    state = {
      ...state,
      lots: state.lots.map(l => ({ ...l, status: 'closed' as const })),
    };
    const newState = aiBids(state, Date.now());
    newState.lots.forEach((lot, i) => {
      expect(lot.currentBid).toBe(state.lots[i].currentBid);
    });
  });

  it('does not bid on expired lots', () => {
    let state = initGame();
    state = {
      ...state,
      lots: state.lots.map(l => ({ ...l, timeRemaining: 0 })),
    };
    const newState = aiBids(state, Date.now());
    newState.lots.forEach((lot, i) => {
      expect(lot.currentBid).toBe(state.lots[i].currentBid);
    });
  });

  it('AI bids increase the currentBid', () => {
    let state = initGame();
    // Run AI bids many times to ensure at least one fires
    let anyBidIncreased = false;
    for (let i = 0; i < 50; i++) {
      const newState = aiBids(state, Date.now());
      if (newState.lots.some((l, j) => l.currentBid > state.lots[j].currentBid)) {
        anyBidIncreased = true;
        break;
      }
    }
    expect(anyBidIncreased).toBe(true);
  });
});

describe('sellRelic', () => {
  it('removes relic from portfolio and adds market price to currency', () => {
    let state = initGame();
    // Manually add a portfolio item
    state = {
      ...state,
      portfolio: [{
        relic: state.lots[0].relic,
        purchasePrice: 100,
        acquiredAt: Date.now(),
        marketPrice: 120,
      }],
      currency: 2900,
    };
    const newState = sellRelic(state, state.lots[0].relic.id);
    expect(newState.portfolio).toHaveLength(0);
    expect(newState.currency).toBe(2900 + 120);
  });

  it('returns unchanged state for invalid relic ID', () => {
    const state = initGame();
    const result = sellRelic(state, 'nonexistent-relic');
    expect(result).toBe(state);
  });
});

describe('enshrineRelic', () => {
  it('moves relic from portfolio to saint collection', () => {
    let state = initGame();
    const relic = state.lots[0].relic;
    state = {
      ...state,
      portfolio: [{
        relic,
        purchasePrice: 100,
        acquiredAt: Date.now(),
        marketPrice: 100,
      }],
    };
    const newState = enshrineRelic(state, relic.id);
    expect(newState.portfolio).toHaveLength(0);
    const saint = newState.saints.find(s => s.id === relic.saintId)!;
    expect(saint.collectedRelics).toHaveLength(1);
    expect(saint.collectedRelics[0].id).toBe(relic.id);
  });

  it('does not double-enshrine the same relic', () => {
    let state = initGame();
    const relic = state.lots[0].relic;
    // Pre-populate the saint with this relic already enshrined
    state = {
      ...state,
      saints: state.saints.map(s =>
        s.id === relic.saintId
          ? { ...s, collectedRelics: [{ name: relic.name, id: relic.id }] }
          : s
      ),
      portfolio: [{
        relic,
        purchasePrice: 100,
        acquiredAt: Date.now(),
        marketPrice: 100,
      }],
    };
    const newState = enshrineRelic(state, relic.id);
    const saint = newState.saints.find(s => s.id === relic.saintId)!;
    expect(saint.collectedRelics).toHaveLength(1); // Still 1, not 2
  });

  it('returns unchanged state for invalid relic ID', () => {
    const state = initGame();
    const result = enshrineRelic(state, 'nonexistent');
    expect(result).toBe(state);
  });
});

import { describe, it, expect } from 'vitest';
import { initGame, commission, suppress, fabricate, tickHeadlines, getNetWorth } from '../game/engine';

describe('commission', () => {
  it('deducts cost and creates a headline', () => {
    const state = initGame();
    const result = commission(state, 'ambrose');
    expect(result.currency).toBeLessThan(state.currency);
    expect(result.activeHeadlines).toHaveLength(1);
    expect(result.activeHeadlines[0].type).toBe('commission');
    expect(result.activeHeadlines[0].saintId).toBe('ambrose');
  });

  it('boosts sentiment for target saint', () => {
    const state = initGame();
    const result = commission(state, 'lucia');
    expect(result.market.sentiment.lucia).toBeGreaterThan(0);
  });

  it('returns unchanged state if insufficient currency', () => {
    const state = { ...initGame(), currency: 0 };
    const result = commission(state, 'ambrose');
    expect(result).toBe(state);
  });

  it('returns unchanged state for invalid saint', () => {
    const state = initGame();
    const result = commission(state, 'nonexistent');
    expect(result).toBe(state);
  });
});

describe('suppress', () => {
  it('halves ticks remaining on heresy headline', () => {
    let state = initGame();
    // Manually add a heresy headline
    state = {
      ...state,
      activeHeadlines: [{
        id: 1,
        type: 'heresy',
        saintId: 'ambrose',
        saintName: 'AMBROSE',
        title: 'Test heresy',
        sentimentDelta: -0.2,
        ticksRemaining: 20,
        collapseChance: 0,
      }],
    };
    const result = suppress(state, 1);
    expect(result.currency).toBeLessThan(state.currency);
    expect(result.activeHeadlines[0].ticksRemaining).toBe(10);
  });

  it('returns unchanged state for non-heresy headline', () => {
    let state = initGame();
    state = {
      ...state,
      activeHeadlines: [{
        id: 1,
        type: 'commission',
        saintId: 'ambrose',
        saintName: 'AMBROSE',
        title: 'Test',
        sentimentDelta: 0.3,
        ticksRemaining: 5,
        collapseChance: 0,
      }],
    };
    const result = suppress(state, 1);
    expect(result).toBe(state);
  });
});

describe('fabricate', () => {
  it('deducts cost and creates a fabrication headline', () => {
    const state = initGame();
    const result = fabricate(state, 'sebastian');
    expect(result.currency).toBe(state.currency - 175);
    expect(result.activeHeadlines).toHaveLength(1);
    expect(result.activeHeadlines[0].type).toBe('fabrication');
    expect(result.activeHeadlines[0].collapseChance).toBe(0.02);
  });

  it('creates massive sentiment spike', () => {
    const state = initGame();
    const result = fabricate(state, 'teresa');
    expect(result.market.sentiment.teresa).toBeGreaterThanOrEqual(0.8);
  });
});

describe('tickHeadlines', () => {
  it('decrements ticks remaining', () => {
    let state = initGame();
    state = {
      ...state,
      activeHeadlines: [{
        id: 1,
        type: 'commission',
        saintId: 'ambrose',
        saintName: 'AMBROSE',
        title: 'Test',
        sentimentDelta: 0.3,
        ticksRemaining: 3,
        collapseChance: 0,
      }],
    };
    const result = tickHeadlines(state);
    expect(result.activeHeadlines[0].ticksRemaining).toBe(2);
  });

  it('removes expired headlines', () => {
    let state = initGame();
    state = {
      ...state,
      activeHeadlines: [{
        id: 1,
        type: 'commission',
        saintId: 'ambrose',
        saintName: 'AMBROSE',
        title: 'Test',
        sentimentDelta: 0.3,
        ticksRemaining: 1,
        collapseChance: 0,
      }],
    };
    const result = tickHeadlines(state);
    expect(result.activeHeadlines).toHaveLength(0);
  });

  it('increases fabrication collapse chance each tick', () => {
    let state = initGame();
    state = {
      ...state,
      activeHeadlines: [{
        id: 1,
        type: 'fabrication',
        saintId: 'ambrose',
        saintName: 'AMBROSE',
        title: 'Miracle',
        sentimentDelta: 0.8,
        ticksRemaining: 15,
        collapseChance: 0.02,
      }],
    };
    // Run tick - collapse chance should increase by 0.03
    const result = tickHeadlines(state);
    if (result.activeHeadlines.length > 0) {
      // If it didn't collapse, check chance increased
      expect(result.activeHeadlines[0].collapseChance).toBeGreaterThan(0.02);
    }
    // If it collapsed, that's also valid (low probability but possible)
  });
});

describe('getNetWorth', () => {
  it('sums currency and portfolio market values', () => {
    let state = initGame();
    state = {
      ...state,
      currency: 2000,
      portfolio: [
        { relic: state.lots[0].relic, purchasePrice: 100, acquiredAt: Date.now(), marketPrice: 150 },
        { relic: state.lots[1].relic, purchasePrice: 200, acquiredAt: Date.now(), marketPrice: 180 },
      ],
    };
    expect(getNetWorth(state)).toBe(2000 + 150 + 180);
  });

  it('equals currency when portfolio is empty', () => {
    const state = initGame();
    expect(getNetWorth(state)).toBe(state.currency);
  });
});

import { describe, it, expect } from 'vitest';
import { initMarket, tickMarket, getMarketPrice, applyEvent, generateMarketEvent } from '../game/pricing';
import { Saint, PortfolioItem } from '../game/types';

function makeSaints(): Saint[] {
  return [
    { id: 'ambrose', name: 'AMBROSE', totalRelics: 12, collectedRelics: [] },
    { id: 'lucia', name: 'LUCIA', totalRelics: 10, collectedRelics: [] },
    { id: 'sebastian', name: 'SEBASTIAN', totalRelics: 12, collectedRelics: [] },
    { id: 'teresa', name: 'TERESA', totalRelics: 8, collectedRelics: [] },
    { id: 'bartholomew', name: 'BARTHOLOMEW', totalRelics: 11, collectedRelics: [] },
    { id: 'agatha', name: 'AGATHA', totalRelics: 9, collectedRelics: [] },
    { id: 'francis', name: 'FRANCIS', totalRelics: 13, collectedRelics: [] },
    { id: 'catherine', name: 'CATHERINE', totalRelics: 10, collectedRelics: [] },
  ];
}

function makePortfolioItem(saintId: string, relicClass: number, purchasePrice: number): PortfolioItem {
  return {
    relic: {
      id: `${saintId}-0`,
      name: 'Test Relic',
      saintId,
      saintName: saintId.toUpperCase(),
      relicClass,
      provenance: 'Test',
      partIndex: 0,
    },
    purchasePrice,
    acquiredAt: Date.now(),
    marketPrice: purchasePrice,
  };
}

describe('initMarket', () => {
  it('initializes all saint demands to 1.0', () => {
    const market = initMarket();
    Object.values(market.saintDemand).forEach(d => {
      expect(d).toBe(1.0);
    });
  });

  it('initializes globalTemp to 1.0', () => {
    expect(initMarket().globalTemp).toBe(1.0);
  });

  it('starts with no active events', () => {
    expect(initMarket().activeEvents).toEqual([]);
  });

  it('has entries for all 8 saints', () => {
    const market = initMarket();
    expect(Object.keys(market.saintDemand)).toHaveLength(8);
  });
});

describe('tickMarket', () => {
  it('applies mean reversion toward 1.0', () => {
    const market = initMarket();
    // Manually set a demand high
    market.saintDemand.ambrose = 1.5;
    const ticked = tickMarket(market);
    // Should drift toward 1.0 (not exactly — there's noise)
    expect(ticked.saintDemand.ambrose).toBeLessThan(1.5 + 0.05);
  });

  it('clamps saint demand to [0.4, 2.0]', () => {
    const market = initMarket();
    market.saintDemand.ambrose = 2.1;
    market.saintDemand.lucia = 0.2;
    const ticked = tickMarket(market);
    expect(ticked.saintDemand.ambrose).toBeLessThanOrEqual(2.0);
    expect(ticked.saintDemand.lucia).toBeGreaterThanOrEqual(0.4);
  });

  it('clamps globalTemp to [0.6, 1.5]', () => {
    const market = initMarket();
    market.globalTemp = 1.6;
    const ticked = tickMarket(market);
    expect(ticked.globalTemp).toBeLessThanOrEqual(1.5);
  });

  it('filters out expired events', () => {
    const market = initMarket();
    market.activeEvents = [{
      id: 'test',
      category: 'heresy',
      title: 'Test',
      effect: 'Test',
      affectedSaints: ['ambrose'],
      demandDelta: -0.2,
      globalDelta: 0,
      supplyEffect: 1,
      startedAt: Date.now() - 100000, // Started 100s ago
      duration: 50000, // 50s duration — already expired
    }];
    const ticked = tickMarket(market);
    expect(ticked.activeEvents).toHaveLength(0);
  });
});

describe('getMarketPrice', () => {
  it('applies saint demand multiplier', () => {
    const market = initMarket();
    const saints = makeSaints();
    const item = makePortfolioItem('ambrose', 2, 100);

    market.saintDemand.ambrose = 1.5;
    const price = getMarketPrice(item, market, saints);
    // 100 * 1.5 (saint) * 1.0 (class II) * 1.0 (globalTemp) * 1.0 (no completion bonus)
    expect(price).toBe(150);
  });

  it('applies class multiplier', () => {
    const market = initMarket();
    const saints = makeSaints();

    const classI = makePortfolioItem('ambrose', 1, 100);
    const classIII = makePortfolioItem('ambrose', 3, 100);

    expect(getMarketPrice(classI, market, saints)).toBe(120); // 100 * 1.2
    expect(getMarketPrice(classIII, market, saints)).toBe(85); // 100 * 0.85
  });

  it('applies completion premium above 80%', () => {
    const market = initMarket();
    const saints = makeSaints();
    const saint = saints.find(s => s.id === 'teresa')!;
    // Teresa has 8 relics, 80% = 6.4, so 7 collected triggers premium
    saint.collectedRelics = Array.from({ length: 7 }, (_, i) => ({ name: `relic-${i}`, id: `teresa-${i}` }));

    const item = makePortfolioItem('teresa', 2, 100);
    const price = getMarketPrice(item, market, saints);
    // ratio = 7/8 = 0.875, bonus = 1 + (0.875 - 0.8) * 5 = 1.375
    expect(price).toBeGreaterThan(130);
    expect(price).toBeLessThan(145);
  });

  it('returns at least 1', () => {
    const market = initMarket();
    const saints = makeSaints();
    market.saintDemand.ambrose = 0.4;
    market.globalTemp = 0.6;
    const item = makePortfolioItem('ambrose', 3, 1);
    expect(getMarketPrice(item, market, saints)).toBeGreaterThanOrEqual(1);
  });
});

describe('applyEvent', () => {
  it('applies immediate demand shock', () => {
    const market = initMarket();
    const event = {
      id: 'test',
      category: 'heresy' as const,
      title: 'Test',
      effect: 'Test',
      affectedSaints: ['ambrose'],
      demandDelta: -0.20,
      globalDelta: 0,
      supplyEffect: 1,
      startedAt: Date.now(),
      duration: 45000,
    };
    const newMarket = applyEvent(market, event);
    // 50% of delta applied immediately: 1.0 + (-0.20 * 0.5) = 0.9
    expect(newMarket.saintDemand.ambrose).toBe(0.9);
  });

  it('adds event to activeEvents', () => {
    const market = initMarket();
    const event = {
      id: 'test',
      category: 'pilgrimage' as const,
      title: 'Test',
      effect: 'Test',
      affectedSaints: ['lucia'],
      demandDelta: 0.3,
      globalDelta: 0.05,
      supplyEffect: 1,
      startedAt: Date.now(),
      duration: 60000,
    };
    const newMarket = applyEvent(market, event);
    expect(newMarket.activeEvents).toHaveLength(1);
    expect(newMarket.activeEvents[0].id).toBe('test');
  });

  it('applies global delta', () => {
    const market = initMarket();
    const event = {
      id: 'test',
      category: 'papal' as const,
      title: 'Test',
      effect: 'Test',
      affectedSaints: ['ambrose'],
      demandDelta: 0,
      globalDelta: 0.12,
      supplyEffect: 1,
      startedAt: Date.now(),
      duration: 90000,
    };
    const newMarket = applyEvent(market, event);
    expect(newMarket.globalTemp).toBe(1.0 + 0.12 * 0.5); // 1.06
  });
});

describe('generateMarketEvent', () => {
  it('returns a valid event structure', () => {
    const event = generateMarketEvent();
    expect(event.id).toBeTruthy();
    expect(event.category).toBeTruthy();
    expect(event.title).toBeTruthy();
    expect(event.affectedSaints.length).toBeGreaterThan(0);
    expect(typeof event.demandDelta).toBe('number');
    expect(typeof event.duration).toBe('number');
  });
});

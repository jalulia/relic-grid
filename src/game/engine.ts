import { GameState, Lot, Saint, PortfolioItem } from './types';
import { SAINTS_DATA, getRelicClass, generateProvenance } from './data';
import { initMarket, tickMarket, getMarketPrice } from './pricing';
import { createBidders, evaluateBidderBid, type AIBidder } from './aiBidders';

const STARTING_CURRENCY = 3000;
const INITIAL_LOTS = 12;
const MAX_LOTS = 20;
const LOT_SPAWN_INTERVAL = 7000;
const TICK_INTERVAL = 1000;
const AI_BID_INTERVAL = 2000;

function makeLotId(counter: number): string {
  return `LOT-${String(counter).padStart(4, '0')}`;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Track which relics are currently on the market to avoid duplicates
function getActiveRelicIds(lots: Lot[]): Set<string> {
  return new Set(lots.filter(l => l.status === 'active').map(l => l.relic.id));
}

function createLot(counter: number, saints: Saint[], existingLots: Lot[], portfolioRelicIds: Set<string> = new Set()): Lot | null {
  const activeRelicIds = getActiveRelicIds(existingLots);

  // Try up to 10 times to find a non-duplicate relic
  for (let attempt = 0; attempt < 10; attempt++) {
    const saintData = SAINTS_DATA[Math.floor(Math.random() * SAINTS_DATA.length)];
    const saint = saints.find(s => s.id === saintData.id)!;
    const availableRelics = saintData.relics.filter(r => {
      const relicId = `${saintData.id}-${saintData.relics.indexOf(r)}`;
      return !saint.collectedRelics.some(cr => cr.name === r) && !activeRelicIds.has(relicId) && !portfolioRelicIds.has(relicId);
    });

    if (availableRelics.length === 0) continue;

    const relicName = availableRelics[Math.floor(Math.random() * availableRelics.length)];
    const partIndex = saintData.relics.indexOf(relicName);
    const startingBid = randomInt(15, 150);
    const totalTime = randomInt(30, 90);

    return {
      id: makeLotId(counter),
      relic: {
        id: `${saintData.id}-${partIndex}`,
        name: relicName,
        saintId: saintData.id,
        saintName: saintData.name,
        relicClass: getRelicClass(relicName),
        provenance: generateProvenance(saintData.provenance),
        partIndex,
      },
      currentBid: startingBid,
      yourBid: null,
      bidCount: randomInt(0, 2),
      timeRemaining: totalTime,
      totalTime,
      status: 'active',
      weight: 1,
      flash: null,
      flashUntil: 0,
      bidderName: null,
    };
  }

  return null;
}

export function initGame(): GameState {
  const saints: Saint[] = SAINTS_DATA.map(s => ({
    id: s.id,
    name: s.name,
    totalRelics: s.relics.length,
    collectedRelics: [],
  }));

  const lots: Lot[] = [];
  for (let i = 0; i < INITIAL_LOTS; i++) {
    const lot = createLot(i + 1, saints, lots, new Set());
    if (lot) lots.push(lot);
  }

  return {
    currency: STARTING_CURRENCY,
    lots,
    saints,
    portfolio: [],
    market: initMarket(),
    completedSaint: null,
    lotCounter: INITIAL_LOTS,
    gameOver: null,
    pendingMessages: [],
    aiBidders: createBidders(),
    activeHeadlines: [],
    headlineCounter: 0,
  };
}

export function placeBid(state: GameState, lotId: string, amount: number): GameState {
  const lot = state.lots.find(l => l.id === lotId);
  if (!lot || (lot.status !== 'active' && lot.status !== 'closing')) return state;
  if (amount <= lot.currentBid) return state;
  if (amount > state.currency) return state;

  const newLots = state.lots.map(l => {
    if (l.id !== lotId) return l;
    return {
      ...l,
      currentBid: amount,
      yourBid: amount,
      bidCount: l.bidCount + 1,
      weight: Math.min(l.weight + 0.3, 3),
    };
  });

  return { ...state, lots: newLots };
}

export function tick(state: GameState, now: number): GameState {
  let { lots, saints, currency, completedSaint, lotCounter } = state;
  let newCompletedSaint: string | null = completedSaint;

  // Clone saints array
  saints = saints.map(s => ({ ...s }));

  lots = lots.map(lot => {
    if (lot.status !== 'active') return lot;

    let l = { ...lot };

    // Clear flash
    if (l.flash && now > l.flashUntil) {
      l.flash = null;
    }

    l.timeRemaining = Math.max(0, l.timeRemaining - 1);

    // Update weight based on time/activity
    const timeRatio = l.timeRemaining / l.totalTime;
    const activityBoost = Math.min(l.bidCount * 0.1, 0.8);
    const hasYourBid = l.yourBid !== null ? 1.5 : 0; // Tuned: was 1.0
    l.weight = 0.8 + (1 - timeRatio) * 0.8 + activityBoost + hasYourBid;
    if (l.timeRemaining < 15) l.weight += 0.8; // Tuned: was 0.5

    // Set closing state for lots nearing expiry
    if (l.timeRemaining > 0 && l.timeRemaining < 10) {
      l.status = 'closing';
    }

    // Lot expires
    if (l.timeRemaining <= 0) {
      if (l.yourBid !== null && l.yourBid >= l.currentBid) {
        l.status = 'won';
        l.flash = 'win';
        l.flashUntil = now + 3000; // Tuned: was 2000
      } else {
        l.status = l.yourBid !== null ? 'lost' : 'closed';
      }
    }

    return l;
  });

  // Process wins → add to portfolio (once only — check timeRemaining === 0)
  const newPortfolio = [...state.portfolio];
  const updatedBidders = state.aiBidders.map(b => ({ ...b }));
  lots.forEach(lot => {
    if (lot.status === 'won' && lot.timeRemaining === 0) {
      if (currency >= lot.currentBid) {
        currency -= lot.currentBid;
        newPortfolio.push({
          relic: lot.relic,
          purchasePrice: lot.currentBid,
          acquiredAt: Date.now(),
          marketPrice: lot.currentBid,
        });
      } else {
        lot.status = 'lost';
      }
    }
    // Deduct AI bidder budget when AI wins a lot (lot closed with AI leading)
    if (lot.status === 'closed' && lot.timeRemaining === 0 && lot.bidderName) {
      const bidder = updatedBidders.find(b => b.name === lot.bidderName);
      if (bidder) {
        bidder.budget = Math.max(0, bidder.budget - lot.currentBid);
      }
    }
  });
  currency = Math.max(0, currency);

  // Remove expired lots after 2s
  lots = lots.filter(l => {
    if (l.status === 'won' || l.status === 'lost' || l.status === 'closed') {
      return l.timeRemaining > -2;
    }
    return true;
  });

  lots = lots.map(l => {
    if (l.status === 'won' || l.status === 'lost' || l.status === 'closed') {
      return { ...l, timeRemaining: l.timeRemaining - 1 };
    }
    return l;
  });

  // Tick market prices and update portfolio valuations
  const updatedMarket = tickMarket(state.market);
  const updatedPortfolio = newPortfolio.map(item => ({
    ...item,
    marketPrice: getMarketPrice(item, updatedMarket, saints),
  }));

  const result: GameState = {
    ...state,
    lots,
    saints,
    currency,
    portfolio: updatedPortfolio,
    aiBidders: updatedBidders,
    market: updatedMarket,
    completedSaint: newCompletedSaint,
    lotCounter,
  };

  return checkGameOver(result);
}

function checkGameOver(state: GameState): GameState {
  if (state.gameOver) return state;

  // Victory: all 8 saints complete
  const allComplete = state.saints.every(s => s.collectedRelics.length === s.totalRelics);
  if (allComplete) {
    return {
      ...state,
      gameOver: {
        reason: 'victory',
        netWorth: getNetWorth(state),
        saintsCompleted: 8,
        relicsCollected: state.saints.reduce((sum, s) => sum + s.collectedRelics.length, 0),
        timePlayed: 0, // Will be set by Index.tsx with actual elapsed time
      },
    };
  }

  // Bankruptcy: no money, no portfolio, no winning bids in progress
  if (
    state.currency === 0 &&
    state.portfolio.length === 0 &&
    !state.lots.some(l => (l.status === 'active' || l.status === 'closing') && l.yourBid !== null && l.yourBid >= l.currentBid)
  ) {
    return {
      ...state,
      gameOver: {
        reason: 'bankrupt',
        netWorth: 0,
        saintsCompleted: state.saints.filter(s => s.collectedRelics.length === s.totalRelics).length,
        relicsCollected: state.saints.reduce((sum, s) => sum + s.collectedRelics.length, 0),
        timePlayed: 0,
      },
    };
  }

  return state;
}

export function spawnLot(state: GameState): GameState {
  if (state.lots.filter(l => l.status === 'active' || l.status === 'closing').length >= MAX_LOTS) return state;

  const newCounter = state.lotCounter + 1;
  const portfolioRelicIds = new Set(state.portfolio.map(p => p.relic.id));
  const newLot = createLot(newCounter, state.saints, state.lots, portfolioRelicIds);

  if (!newLot) return state;

  return {
    ...state,
    lots: [...state.lots, newLot],
    lotCounter: newCounter,
  };
}

export function aiBids(state: GameState, now: number): GameState {
  const lots = [...state.lots];
  const bidders = state.aiBidders.map(b => ({ ...b }));
  const pendingMessages = [...state.pendingMessages];

  // Each named bidder evaluates all lots
  for (const bidder of bidders) {
    if (bidder.budget <= 0) continue;

    // Shuffle lots to avoid always bidding on first eligible
    const indices = lots.map((_, i) => i).sort(() => Math.random() - 0.5);

    for (const idx of indices) {
      const lot = lots[idx];
      const result = evaluateBidderBid(bidder, lot, state.market);
      if (!result) continue;

      const wasWinning = lot.yourBid !== null && lot.yourBid >= lot.currentBid;
      const nowOutbid = lot.yourBid !== null && lot.yourBid < result.amount;

      lots[idx] = {
        ...lot,
        currentBid: result.amount,
        bidCount: lot.bidCount + 1,
        weight: Math.min(lot.weight + 0.15, 3),
        flash: wasWinning && nowOutbid ? 'outbid' as const : lot.flash,
        flashUntil: wasWinning && nowOutbid ? now + 2000 : lot.flashUntil,
        bidderName: result.bidderName,
      };

      pendingMessages.push(`[MARKET] ${result.bidderName} bid ◈${result.amount} on ${lot.id}`);

      // Each bidder bids on at most 1 lot per tick
      break;
    }
  }

  return { ...state, lots, aiBidders: bidders, pendingMessages };
}

export function sellRelic(state: GameState, relicId: string): GameState {
  const itemIndex = state.portfolio.findIndex(p => p.relic.id === relicId);
  if (itemIndex === -1) return state;

  const item = state.portfolio[itemIndex];
  const sellPrice = item.marketPrice;
  const portfolio = state.portfolio.filter((_, i) => i !== itemIndex);

  return { ...state, currency: state.currency + sellPrice, portfolio };
}

export function enshrineRelic(state: GameState, relicId: string): GameState {
  const itemIndex = state.portfolio.findIndex(p => p.relic.id === relicId);
  if (itemIndex === -1) return state;

  const item = state.portfolio[itemIndex];
  const saints = state.saints.map(s => {
    if (s.id !== item.relic.saintId) return s;
    if (s.collectedRelics.some(r => r.id === item.relic.id)) return s;
    return { ...s, collectedRelics: [...s.collectedRelics, { name: item.relic.name, id: item.relic.id }] };
  });

  const portfolio = state.portfolio.filter((_, i) => i !== itemIndex);
  const pendingMessages = [...state.pendingMessages];

  let completedSaint = state.completedSaint;
  const saint = saints.find(s => s.id === item.relic.saintId);
  if (saint) {
    const pct = Math.round((saint.collectedRelics.length / saint.totalRelics) * 100);
    // Milestone messages at 25%, 50%, 75%
    if (pct >= 25 && pct < 50 && Math.round(((saint.collectedRelics.length - 1) / saint.totalRelics) * 100) < 25) {
      pendingMessages.push(`[MILESTONE] ${saint.name} — 25% COLLECTED`);
    } else if (pct >= 50 && pct < 75 && Math.round(((saint.collectedRelics.length - 1) / saint.totalRelics) * 100) < 50) {
      pendingMessages.push(`[MILESTONE] ${saint.name} — 50% COLLECTED`);
    } else if (pct >= 75 && pct < 100 && Math.round(((saint.collectedRelics.length - 1) / saint.totalRelics) * 100) < 75) {
      pendingMessages.push(`[MILESTONE] ${saint.name} — 75% COLLECTED`);
    }

    if (saint.collectedRelics.length === saint.totalRelics) {
      completedSaint = saint.name;
    }
  }

  return { ...state, saints, portfolio, completedSaint, pendingMessages };
}

export function getNetWorth(state: GameState): number {
  return state.currency + state.portfolio.reduce((sum, item) => sum + item.marketPrice, 0);
}

// ── MEDIA ACTIONS ──

import { Headline } from './types';

function getCommissionCost(sentiment: number): number {
  // Higher current sentiment → more expensive to commission
  return Math.round(50 + Math.abs(sentiment) * 50);
}

function getSuppressCost(): number {
  return 40;
}

function getFabricateCost(): number {
  return 175;
}

export function commission(state: GameState, saintId: string): GameState {
  const saint = state.saints.find(s => s.id === saintId);
  if (!saint) return state;
  const cost = getCommissionCost(state.market.sentiment[saintId] ?? 0);
  if (state.currency < cost) return state;

  const id = state.headlineCounter + 1;
  const headline: Headline = {
    id,
    type: 'commission',
    saintId,
    saintName: saint.name,
    title: `Devotional Surge Reported for ${saint.name} Relics`,
    sentimentDelta: 0.3,
    ticksRemaining: 5,
    collapseChance: 0,
  };

  const sentiment = { ...state.market.sentiment };
  sentiment[saintId] = Math.min(1, (sentiment[saintId] ?? 0) + 0.3);

  return {
    ...state,
    currency: state.currency - cost,
    activeHeadlines: [...state.activeHeadlines, headline],
    headlineCounter: id,
    market: { ...state.market, sentiment },
    pendingMessages: [...state.pendingMessages, `[MEDIA] Commissioned positive story for ${saint.name} — cost ◈${cost}`],
  };
}

export function suppress(state: GameState, headlineId: number): GameState {
  const headline = state.activeHeadlines.find(h => h.id === headlineId && h.type === 'heresy');
  if (!headline) return state;
  const cost = getSuppressCost();
  if (state.currency < cost) return state;

  const activeHeadlines = state.activeHeadlines.map(h =>
    h.id === headlineId ? { ...h, ticksRemaining: Math.ceil(h.ticksRemaining / 2) } : h
  );

  return {
    ...state,
    currency: state.currency - cost,
    activeHeadlines,
    pendingMessages: [...state.pendingMessages, `[MEDIA] Suppressed negative headline — cost ◈${cost}`],
  };
}

export function fabricate(state: GameState, saintId: string): GameState {
  const saint = state.saints.find(s => s.id === saintId);
  if (!saint) return state;
  const cost = getFabricateCost();
  if (state.currency < cost) return state;

  const id = state.headlineCounter + 1;
  const headline: Headline = {
    id,
    type: 'fabrication',
    saintId,
    saintName: saint.name,
    title: `MIRACLE REPORTED: ${saint.name} Relic Produces Supernatural Phenomenon`,
    sentimentDelta: 0.8,
    ticksRemaining: 15,
    collapseChance: 0.02,
  };

  const sentiment = { ...state.market.sentiment };
  sentiment[saintId] = Math.min(1, (sentiment[saintId] ?? 0) + 0.8);

  return {
    ...state,
    currency: state.currency - cost,
    activeHeadlines: [...state.activeHeadlines, headline],
    headlineCounter: id,
    market: { ...state.market, sentiment },
    pendingMessages: [...state.pendingMessages, `[MEDIA] Fabricated miracle story for ${saint.name} — cost ◈${cost}`],
  };
}

export function tickHeadlines(state: GameState): GameState {
  let pendingMessages = [...state.pendingMessages];
  const sentiment = { ...state.market.sentiment };
  let lotsFrozen = false;

  const activeHeadlines = state.activeHeadlines
    .map(h => ({ ...h, ticksRemaining: h.ticksRemaining - 1 }))
    .filter(h => {
      if (h.ticksRemaining <= 0) return false;

      // Fabrication collapse check
      if (h.type === 'fabrication') {
        h.collapseChance += 0.03; // Increases each tick
        if (Math.random() < h.collapseChance) {
          // COLLAPSE!
          sentiment[h.saintId] = Math.max(-1, (sentiment[h.saintId] ?? 0) - 0.6);
          pendingMessages.push(`[TRIBUNAL] FRAUDULENT MIRACLE CLAIM EXPOSED — ${h.saintName} sentiment crashes`);
          lotsFrozen = true;
          return false; // Remove the fabrication
        }
      }

      return true;
    });

  // If a fabrication collapsed, freeze player lots temporarily (8s = 8 ticks)
  let lots = state.lots;
  if (lotsFrozen) {
    pendingMessages.push(`[TRIBUNAL] Investigation underway — your lots frozen for 8 seconds`);
    // The freeze is handled by Index.tsx via slowedUntil — we just signal it via pendingMessages
  }

  return {
    ...state,
    activeHeadlines,
    market: { ...state.market, sentiment },
    pendingMessages,
  };
}

export function getMediaCosts(state: GameState): { commission: (saintId: string) => number; suppress: number; fabricate: number } {
  return {
    commission: (saintId: string) => getCommissionCost(state.market.sentiment[saintId] ?? 0),
    suppress: getSuppressCost(),
    fabricate: getFabricateCost(),
  };
}

export { TICK_INTERVAL, LOT_SPAWN_INTERVAL, AI_BID_INTERVAL };

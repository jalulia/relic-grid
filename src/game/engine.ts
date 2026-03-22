import { GameState, Lot, Saint } from './types';
import { SAINTS_DATA, getRelicClass, generateProvenance } from './data';

const STARTING_CURRENCY = 5000;
const INITIAL_LOTS = 18;
const MAX_LOTS = 30;
const LOT_SPAWN_INTERVAL = 5000;
const TICK_INTERVAL = 1000;
const AI_BID_INTERVAL = 3000;
const SNIPE_THRESHOLD = 5;
const SNIPE_EXTENSION = 8;
const SAINT_COMPLETION_BONUS_PER_RELIC = 500;

function makeLotId(counter: number): string {
  return `LOT-${String(counter).padStart(4, '0')}`;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getActiveRelicIds(lots: Lot[]): Set<string> {
  return new Set(lots.filter(l => l.status === 'active').map(l => l.relic.id));
}

function createLot(counter: number, saints: Saint[], existingLots: Lot[]): Lot | null {
  const activeRelicIds = getActiveRelicIds(existingLots);

  for (let attempt = 0; attempt < 10; attempt++) {
    const saintData = SAINTS_DATA[Math.floor(Math.random() * SAINTS_DATA.length)];
    const saint = saints.find(s => s.id === saintData.id)!;
    const availableRelics = saintData.relics.filter(r => {
      const relicId = `${saintData.id}-${saintData.relics.indexOf(r)}`;
      return !saint.collectedRelics.includes(r) && !activeRelicIds.has(relicId);
    });

    if (availableRelics.length === 0) continue;

    const relicName = availableRelics[Math.floor(Math.random() * availableRelics.length)];
    const partIndex = saintData.relics.indexOf(relicName);
    const startingBid = randomInt(15, 150);
    const totalTime = randomInt(45, 150);

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
      sniped: false,
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
    const lot = createLot(i + 1, saints, lots);
    if (lot) lots.push(lot);
  }

  return {
    currency: STARTING_CURRENCY,
    lots,
    saints,
    completedSaint: null,
    lotCounter: INITIAL_LOTS,
  };
}

export function placeBid(state: GameState, lotId: string, amount: number): GameState {
  const lot = state.lots.find(l => l.id === lotId);
  if (!lot || lot.status !== 'active') return state;
  if (amount <= lot.currentBid) return state;
  if (amount > state.currency) return state;

  const newLots = state.lots.map(l => {
    if (l.id !== lotId) return l;

    // Snipe extension: if bid lands in last SNIPE_THRESHOLD seconds and not already sniped
    let newTime = l.timeRemaining;
    let newSniped = l.sniped;
    if (l.timeRemaining <= SNIPE_THRESHOLD && !l.sniped) {
      newTime = l.timeRemaining + SNIPE_EXTENSION;
      newSniped = true;
    }

    return {
      ...l,
      currentBid: amount,
      yourBid: amount,
      bidCount: l.bidCount + 1,
      weight: Math.min(l.weight + 0.3, 3),
      timeRemaining: newTime,
      sniped: newSniped,
    };
  });

  return { ...state, lots: newLots };
}

export function tick(state: GameState, now: number): GameState {
  let { lots, saints, currency, completedSaint, lotCounter } = state;
  let newCompletedSaint: string | null = completedSaint;

  saints = saints.map(s => ({ ...s }));

  lots = lots.map(lot => {
    if (lot.status !== 'active') return lot;

    let l = { ...lot };

    if (l.flash && now > l.flashUntil) {
      l.flash = null;
    }

    l.timeRemaining = Math.max(0, l.timeRemaining - 1);

    const timeRatio = l.timeRemaining / l.totalTime;
    const activityBoost = Math.min(l.bidCount * 0.1, 0.8);
    const hasYourBid = l.yourBid !== null ? 1.0 : 0;
    l.weight = 0.8 + (1 - timeRatio) * 0.8 + activityBoost + hasYourBid;
    if (l.timeRemaining < 15) l.weight += 0.5;

    if (l.timeRemaining <= 0) {
      if (l.yourBid !== null && l.yourBid >= l.currentBid) {
        l.status = 'won';
        l.flash = 'win';
        l.flashUntil = now + 2000;
      } else {
        l.status = l.yourBid !== null ? 'lost' : 'closed';
      }
    }

    return l;
  });

  // Process wins — with saint completion bonus
  lots.forEach(lot => {
    if (lot.status === 'won') {
      const saint = saints.find(s => s.id === lot.relic.saintId);
      if (saint && !saint.collectedRelics.includes(lot.relic.name)) {
        saint.collectedRelics = [...saint.collectedRelics, lot.relic.name];
        currency -= lot.currentBid;
        if (saint.collectedRelics.length === saint.totalRelics) {
          newCompletedSaint = saint.name;
          // Saint completion bonus!
          currency += saint.totalRelics * SAINT_COMPLETION_BONUS_PER_RELIC;
        }
      }
    }
  });

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

  return {
    ...state,
    lots,
    saints,
    currency,
    completedSaint: newCompletedSaint,
    lotCounter,
  };
}

export function spawnLot(state: GameState): GameState {
  if (state.lots.filter(l => l.status === 'active').length >= MAX_LOTS) return state;

  const newCounter = state.lotCounter + 1;
  const newLot = createLot(newCounter, state.saints, state.lots);

  if (!newLot) return state;

  return {
    ...state,
    lots: [...state.lots, newLot],
    lotCounter: newCounter,
  };
}

export function aiBids(state: GameState, now: number): GameState {
  const lots = state.lots.map(lot => {
    if (lot.status !== 'active') return lot;
    if (lot.timeRemaining <= 0) return lot;

    const chance = lot.timeRemaining < 10 ? 0.2 : lot.timeRemaining < 30 ? 0.08 : 0.03;
    if (Math.random() > chance) return lot;

    const increment = randomInt(3, Math.max(8, Math.floor(lot.currentBid * 0.08)));
    const newBid = lot.currentBid + increment;

    const wasWinning = lot.yourBid !== null && lot.yourBid >= lot.currentBid;
    const nowOutbid = lot.yourBid !== null && lot.yourBid < newBid;

    // Snipe extension for AI bids too
    let newTime = lot.timeRemaining;
    let newSniped = lot.sniped;
    if (lot.timeRemaining <= SNIPE_THRESHOLD && !lot.sniped) {
      newTime = lot.timeRemaining + SNIPE_EXTENSION;
      newSniped = true;
    }

    return {
      ...lot,
      currentBid: newBid,
      bidCount: lot.bidCount + 1,
      weight: Math.min(lot.weight + 0.15, 3),
      flash: wasWinning && nowOutbid ? 'outbid' as const : lot.flash,
      flashUntil: wasWinning && nowOutbid ? now + 1500 : lot.flashUntil,
      timeRemaining: newTime,
      sniped: newSniped,
    };
  });

  return { ...state, lots };
}

export { TICK_INTERVAL, LOT_SPAWN_INTERVAL, AI_BID_INTERVAL, SAINT_COMPLETION_BONUS_PER_RELIC };

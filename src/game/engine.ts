import { GameState, Lot, Saint } from './types';
import { SAINTS_DATA, getRelicClass, generateProvenance } from './data';

const STARTING_CURRENCY = 5000;
const INITIAL_LOTS = 20;
const MAX_LOTS = 35;
const MIN_LOTS = 15;
const LOT_SPAWN_INTERVAL = 4000; // ms
const TICK_INTERVAL = 1000;
const AI_BID_INTERVAL = 2000;

function makeLotId(counter: number): string {
  return `LOT-${String(counter).padStart(4, '0')}`;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createLot(counter: number, saints: Saint[]): Lot {
  const saintData = SAINTS_DATA[Math.floor(Math.random() * SAINTS_DATA.length)];
  const saint = saints.find(s => s.id === saintData.id)!;
  const availableRelics = saintData.relics.filter(r => !saint.collectedRelics.includes(r));
  const relicName = availableRelics.length > 0
    ? availableRelics[Math.floor(Math.random() * availableRelics.length)]
    : saintData.relics[Math.floor(Math.random() * saintData.relics.length)];

  const partIndex = saintData.relics.indexOf(relicName);
  const startingBid = randomInt(20, 200);
  const totalTime = randomInt(30, 120);

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
    bidCount: randomInt(0, 3),
    timeRemaining: totalTime,
    totalTime,
    status: 'active',
    weight: 1,
    flash: null,
    flashUntil: 0,
  };
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
    lots.push(createLot(i + 1, saints));
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
    const activityBoost = Math.min(l.bidCount * 0.15, 1);
    l.weight = 0.5 + (1 - timeRatio) * 1.5 + activityBoost;
    if (l.timeRemaining < 15) l.weight += 1;

    // Lot expires
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

  // Process wins
  lots.forEach(lot => {
    if (lot.status === 'won') {
      const saint = saints.find(s => s.id === lot.relic.saintId);
      if (saint && !saint.collectedRelics.includes(lot.relic.name)) {
        saint.collectedRelics = [...saint.collectedRelics, lot.relic.name];
        currency -= lot.currentBid;
        if (saint.collectedRelics.length === saint.totalRelics) {
          newCompletedSaint = saint.name;
        }
      }
    }
  });

  // Remove closed/won/lost lots after a short delay (keep for 3s for visual)
  lots = lots.filter(l => {
    if (l.status === 'won' || l.status === 'lost' || l.status === 'closed') {
      return l.timeRemaining > -3;
    }
    return true;
  });

  // Decrement time for removed lots
  lots = lots.map(l => {
    if (l.status === 'won' || l.status === 'lost' || l.status === 'closed') {
      return { ...l, timeRemaining: l.timeRemaining - 1 };
    }
    return l;
  });

  return {
    ...state,
    lots,
    saints: [...saints],
    currency,
    completedSaint: newCompletedSaint,
    lotCounter,
  };
}

export function spawnLot(state: GameState): GameState {
  if (state.lots.filter(l => l.status === 'active').length >= MAX_LOTS) return state;

  const newCounter = state.lotCounter + 1;
  const newLot = createLot(newCounter, state.saints);

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

    // Random chance of AI bid
    const chance = lot.timeRemaining < 15 ? 0.3 : 0.08;
    if (Math.random() > chance) return lot;

    const increment = randomInt(5, Math.max(10, Math.floor(lot.currentBid * 0.15)));
    const newBid = lot.currentBid + increment;

    const wasWinning = lot.yourBid !== null && lot.yourBid >= lot.currentBid;
    const nowOutbid = lot.yourBid !== null && lot.yourBid < newBid;

    return {
      ...lot,
      currentBid: newBid,
      bidCount: lot.bidCount + 1,
      weight: Math.min(lot.weight + 0.2, 3),
      flash: wasWinning && nowOutbid ? 'outbid' as const : lot.flash,
      flashUntil: wasWinning && nowOutbid ? now + 1500 : lot.flashUntil,
    };
  });

  return { ...state, lots };
}

export { TICK_INTERVAL, LOT_SPAWN_INTERVAL, AI_BID_INTERVAL };

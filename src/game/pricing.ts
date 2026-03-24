import { PortfolioItem, Saint } from './types';

export interface MarketState {
  saintDemand: Record<string, number>;   // saintId → multiplier (0.6–1.8)
  globalTemp: number;                     // overall market mood (0.7–1.3)
  activeEvents: MarketEvent[];
  lastUpdate: number;
  sentiment: Record<string, number>;     // saintId → sentiment (-1 to +1), mean-reverts slower than demand
  classModifiers: Record<number, number>; // relicClass → multiplier (default 1.0)
}

export interface MarketEvent {
  id: string;
  category: EventCategory;
  title: string;
  effect: string;
  affectedSaints: string[];             // saintIds
  demandDelta: number;                  // applied to affected saints
  globalDelta: number;                  // applied to globalTemp
  supplyEffect: number;                 // lot spawn rate multiplier (1 = normal)
  startedAt: number;
  duration: number;                     // ms
}

export type EventCategory =
  | 'heresy'
  | 'pilgrimage'
  | 'papal'
  | 'plague'
  | 'war'
  | 'schism'
  | 'authentication'
  | 'estate';

// Sect → saint mapping for heresy events
const SECT_SAINTS: Record<string, string[]> = {
  flagellant: ['sebastian', 'francis'],
  cathar: ['catherine', 'teresa'],
  bogomil: ['lucia', 'agatha'],
  gnostic: ['ambrose', 'bartholomew'],
  waldensian: ['francis', 'catherine'],
};

// All saint IDs for events that affect everyone
const ALL_SAINTS = ['ambrose', 'lucia', 'sebastian', 'teresa', 'bartholomew', 'agatha', 'francis', 'catherine'];

// Event templates by category
const EVENT_TEMPLATES: Array<{
  category: EventCategory;
  title: string;
  effect: string;
  saints: string[] | 'random2' | 'all';
  demandDelta: number;
  globalDelta: number;
  supplyEffect: number;
  duration: number;
}> = [
  // HERESY — demand crash on specific saints, brief AI freeze
  { category: 'heresy', title: '[TRIBUNAL] CATHARI doctrine fragments intercepted', effect: 'Catherine/Teresa demand -25%', saints: SECT_SAINTS.cathar, demandDelta: -0.25, globalDelta: 0, supplyEffect: 1, duration: 45000 },
  { category: 'heresy', title: '[TRIBUNAL] FLAGELLANT operatives identified in bid network', effect: 'Sebastian/Francis demand -20%', saints: SECT_SAINTS.flagellant, demandDelta: -0.20, globalDelta: 0, supplyEffect: 1, duration: 40000 },
  { category: 'heresy', title: '[BREACH] BOGOMIL proxy bids detected', effect: 'Lucia/Agatha demand -22%', saints: SECT_SAINTS.bogomil, demandDelta: -0.22, globalDelta: 0, supplyEffect: 1, duration: 45000 },
  { category: 'heresy', title: '[INTERCEPT] GNOSTIC ORDER encrypted signals decoded', effect: 'Ambrose/Bartholomew demand -18%', saints: SECT_SAINTS.gnostic, demandDelta: -0.18, globalDelta: 0, supplyEffect: 1, duration: 35000 },
  { category: 'heresy', title: '[SWEEP] WALDENSIAN sympathizers purged from exchange floor', effect: 'All saints demand -10%', saints: 'all', demandDelta: -0.10, globalDelta: -0.05, supplyEffect: 1, duration: 50000 },

  // PILGRIMAGE — demand surge on 1-2 saints
  { category: 'pilgrimage', title: '[PILGRIMAGE] Caravan from Lyon — Teresa devotees arriving', effect: 'Teresa/Catherine demand +30%', saints: ['teresa', 'catherine'], demandDelta: 0.30, globalDelta: 0.05, supplyEffect: 1, duration: 60000 },
  { category: 'pilgrimage', title: '[PILGRIMAGE] Jubilee pilgrims flooding market', effect: 'All demand +15%', saints: 'all', demandDelta: 0.15, globalDelta: 0.10, supplyEffect: 1, duration: 75000 },
  { category: 'pilgrimage', title: '[PILGRIMAGE] Sebastian feast day — relic demand surging', effect: 'Sebastian/Francis demand +35%', saints: ['sebastian', 'francis'], demandDelta: 0.35, globalDelta: 0.03, supplyEffect: 1, duration: 55000 },

  // PAPAL — global market shift
  { category: 'papal', title: '[PAPAL] New bull issued — relic authentication standards raised', effect: 'Global market +12%', saints: 'all', demandDelta: 0.05, globalDelta: 0.12, supplyEffect: 1, duration: 90000 },
  { category: 'papal', title: '[PAPAL] Excommunication decree — market confidence shaken', effect: 'Global market -15%', saints: 'all', demandDelta: -0.08, globalDelta: -0.15, supplyEffect: 1, duration: 70000 },
  { category: 'papal', title: '[PAPAL] Council convened — canonical review underway', effect: 'Global +8%, volatility rising', saints: 'all', demandDelta: 0.03, globalDelta: 0.08, supplyEffect: 1, duration: 100000 },

  // PLAGUE — panic buying on protectors, others crash
  { category: 'plague', title: '[PLAGUE] Black Death reported in neighboring province', effect: 'Sebastian +40%, others -15%', saints: ['sebastian'], demandDelta: 0.40, globalDelta: -0.15, supplyEffect: 0.6, duration: 70000 },
  { category: 'plague', title: '[PLAGUE] Quarantine declared — trade routes closing', effect: 'Supply -40%, demand chaotic', saints: 'random2', demandDelta: -0.20, globalDelta: -0.10, supplyEffect: 0.6, duration: 60000 },

  // WAR — supply flood or drought
  { category: 'war', title: '[WAR] Crusader relics flooding market from Constantinople', effect: 'Supply surge, prices -20%', saints: 'all', demandDelta: -0.08, globalDelta: -0.12, supplyEffect: 1.8, duration: 50000 },
  { category: 'war', title: '[WAR] Monastery raided — relic supply disrupted', effect: 'Supply -50%, scarcity premium', saints: 'random2', demandDelta: 0.15, globalDelta: 0, supplyEffect: 0.5, duration: 45000 },

  // SCHISM — market splits
  { category: 'schism', title: '[SCHISM] Competing papal claim — market in turmoil', effect: 'High volatility, demand split', saints: 'all', demandDelta: 0, globalDelta: 0, supplyEffect: 1, duration: 90000 },

  // AUTHENTICATION — single relic/saint spike or crash
  { category: 'authentication', title: '[AUTH] Relic verified authentic by papal commission', effect: 'Target saint +35%', saints: 'random2', demandDelta: 0.35, globalDelta: 0.03, supplyEffect: 1, duration: 120000 },
  { category: 'authentication', title: '[AUTH] Forgery exposed — provenance documents fraudulent', effect: 'Target saint -30%', saints: 'random2', demandDelta: -0.30, globalDelta: -0.02, supplyEffect: 1, duration: 90000 },

  // ESTATE — buying opportunity
  { category: 'estate', title: '[ESTATE] Collector death — treasury liquidation at discount', effect: 'Cheap lots incoming', saints: 'all', demandDelta: -0.10, globalDelta: -0.05, supplyEffect: 2.0, duration: 30000 },
  { category: 'estate', title: '[ESTATE] Monastery dissolved — relic dispersal underway', effect: 'Supply surge, bargain hunting', saints: 'random2', demandDelta: -0.15, globalDelta: -0.08, supplyEffect: 1.8, duration: 35000 },
];

// Event category colors for terminal feed
export const EVENT_COLORS: Record<EventCategory, string> = {
  heresy: 'text-destructive',
  pilgrimage: 'text-success',
  papal: 'text-accent',
  plague: 'text-destructive',
  war: 'text-destructive',
  schism: 'text-primary',
  authentication: 'text-accent',
  estate: 'text-success',
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSaints(count: number): string[] {
  const shuffled = [...ALL_SAINTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function initMarket(): MarketState {
  const saintDemand: Record<string, number> = {};
  const sentiment: Record<string, number> = {};
  ALL_SAINTS.forEach(id => { saintDemand[id] = 1.0; sentiment[id] = 0; });

  return {
    saintDemand,
    globalTemp: 1.0,
    activeEvents: [],
    lastUpdate: Date.now(),
    sentiment,
    classModifiers: { 1: 1.0, 2: 1.0, 3: 1.0 },
  };
}

export function generateMarketEvent(): MarketEvent {
  const template = pick(EVENT_TEMPLATES);
  let saints: string[];

  if (template.saints === 'all') {
    saints = [...ALL_SAINTS];
  } else if (template.saints === 'random2') {
    saints = randomSaints(2);
  } else {
    saints = template.saints;
  }

  // For schism: randomly boost some saints, crash others
  const effectiveDemandDelta = template.category === 'schism'
    ? (Math.random() > 0.5 ? 0.25 : -0.25)
    : template.demandDelta;

  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    category: template.category,
    title: template.title,
    effect: template.effect,
    affectedSaints: saints,
    demandDelta: effectiveDemandDelta,
    globalDelta: template.globalDelta,
    supplyEffect: template.supplyEffect,
    startedAt: Date.now(),
    duration: template.duration,
  };
}

export function tickMarket(market: MarketState): MarketState {
  const now = Date.now();
  const saintDemand = { ...market.saintDemand };
  const sentiment = { ...market.sentiment };
  const classModifiers = { ...market.classModifiers };
  let globalTemp = market.globalTemp;

  // Mean reversion toward 1.0 for demand
  Object.keys(saintDemand).forEach(id => {
    const drift = (1.0 - saintDemand[id]) * 0.015;
    const noise = (Math.random() - 0.5) * 0.04;
    saintDemand[id] = clamp(saintDemand[id] + drift + noise, 0.4, 2.0);
  });

  // Sentiment mean-reverts slower than demand (0.005 vs 0.015)
  Object.keys(sentiment).forEach(id => {
    sentiment[id] = sentiment[id] * 0.995; // Slow decay toward 0
    if (Math.abs(sentiment[id]) < 0.01) sentiment[id] = 0;
  });

  // Class modifiers mean-revert toward 1.0
  [1, 2, 3].forEach(cls => {
    classModifiers[cls] += (1.0 - classModifiers[cls]) * 0.02;
  });

  globalTemp += (1.0 - globalTemp) * 0.01 + (Math.random() - 0.5) * 0.02;
  globalTemp = clamp(globalTemp, 0.6, 1.5);

  // Apply active event effects (continuous pressure while active)
  const activeEvents = market.activeEvents.filter(e => now - e.startedAt < e.duration);
  activeEvents.forEach(evt => {
    evt.affectedSaints.forEach(saintId => {
      if (saintDemand[saintId] !== undefined) {
        const tickFraction = 0.02;
        saintDemand[saintId] = clamp(
          saintDemand[saintId] + evt.demandDelta * tickFraction,
          0.4, 2.0
        );
      }
    });
    globalTemp = clamp(globalTemp + evt.globalDelta * 0.01, 0.6, 1.5);
  });

  return {
    ...market,
    saintDemand,
    globalTemp,
    activeEvents,
    sentiment,
    classModifiers,
    lastUpdate: now,
  };
}

export function applyEvent(market: MarketState, event: MarketEvent): MarketState {
  const saintDemand = { ...market.saintDemand };
  let globalTemp = market.globalTemp;

  // Immediate shock when event fires
  event.affectedSaints.forEach(saintId => {
    if (saintDemand[saintId] !== undefined) {
      saintDemand[saintId] = clamp(saintDemand[saintId] + event.demandDelta * 0.5, 0.4, 2.0);
    }
  });
  globalTemp = clamp(globalTemp + event.globalDelta * 0.5, 0.6, 1.5);

  return {
    ...market,
    saintDemand,
    globalTemp,
    activeEvents: [...market.activeEvents, event],
  };
}

export function getMarketPrice(item: PortfolioItem, market: MarketState, saints: Saint[]): number {
  const saintMult = market.saintDemand[item.relic.saintId] ?? 1.0;
  const baseClassMult = ({ 1: 1.2, 2: 1.0, 3: 0.85 } as Record<number, number>)[item.relic.relicClass] ?? 1.0;
  const classEventMult = market.classModifiers?.[item.relic.relicClass] ?? 1.0;
  const completionBonus = getCompletionPremium(item.relic.saintId, saints);
  const base = item.purchasePrice * saintMult * baseClassMult * classEventMult * market.globalTemp * completionBonus;
  return Math.max(1, Math.round(base));
}

function getCompletionPremium(saintId: string, saints: Saint[]): number {
  const saint = saints.find(s => s.id === saintId);
  if (!saint) return 1.0;
  const ratio = saint.collectedRelics.length / saint.totalRelics;
  if (ratio > 0.8) return 1.0 + (ratio - 0.8) * 5; // up to 2x at 100%
  return 1.0;
}

// Get the current supply effect multiplier from active events
export function getSupplyMultiplier(market: MarketState): number {
  const now = Date.now();
  let mult = 1.0;
  market.activeEvents
    .filter(e => now - e.startedAt < e.duration)
    .forEach(e => { mult *= e.supplyEffect; });
  return mult;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

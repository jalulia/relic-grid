import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../game/types';
import { initGame, placeBid, tick, spawnLot, aiBids, enshrineRelic, sellRelic, getNetWorth, tickHeadlines, commission, suppress, fabricate, getMediaCosts, TICK_INTERVAL, LOT_SPAWN_INTERVAL, AI_BID_INTERVAL } from '../game/engine';
import { buildBSP } from '../game/bsp';
import { HerasyReport, generateHeresyReport, generateSystemMessage, getSectEffect } from '../game/heresy';
import { generateMarketEvent, applyEvent } from '../game/pricing';
import GridCell from '../components/GridCell';
import SaintTracker from '../components/SaintTracker';
import SaintCompleteOverlay from '../components/SaintCompleteOverlay';
import LotTicker from '../components/LotTicker';
import FKeyBar, { FKeyView } from '../components/FKeyBar';
import TutorialOverlay from '../components/TutorialOverlay';
import GameOverOverlay from '../components/GameOverOverlay';
import { WindowManagerProvider, useWindowManager } from '../window/WindowManager';
import FloatingWindow from '../window/FloatingWindow';
import BidPanel from '../components/BidPanel';
import SellPanel from '../components/SellPanel';
import PortfolioPanel from '../components/PortfolioPanel';
import EnshrinePanel from '../components/EnshrinePanel';
import IntelPanel from '../components/IntelPanel';
import DoctrinePanel from '../components/DoctrinePanel';
import TerminalFeed from '../components/TerminalFeed';
import SysPanel from '../components/SysPanel';
import MediaPanel from '../components/MediaPanel';
import CompactFeed from '../components/CompactFeed';

const HERESY_SLOWDOWN_MS = 3000;
const FEED_INTERVAL = 2500;
const HERESY_CHANCE = 0.25;
const LOW_CURRENCY_THRESHOLD = 200;

export default function Index() {
  return (
    <WindowManagerProvider>
      <GameView />
    </WindowManagerProvider>
  );
}

function GameView() {
  const { state: wmState, toggleWindow, openWindow, bringToFront } = useWindowManager();
  const [game, setGame] = useState<GameState>(() => initGame());
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [messages, setMessages] = useState<HerasyReport[]>([]);
  const [slowedUntil, setSlowedUntil] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const startTimeRef = useRef(Date.now());
  const msgCounter = useRef(0);
  const tickSkip = useRef(false);
  const lowCurrencyWarned = useRef(false);

  const isSlowed = Date.now() < slowedUntil;
  const isGameOver = game.gameOver !== null;

  useEffect(() => {
    const handler = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Global keyboard handler
  useEffect(() => {
    const VIEW_KEYS: Record<string, FKeyView> = {
      b: 'buy', s: 'sell', p: 'port', n: 'enshrine',
      i: 'intel', d: 'doctrine', l: 'log', y: 'sys', m: 'media',
    };
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();

      // Tutorial recall
      if (key === '?') {
        setShowTutorial(true);
        return;
      }

      // Window toggling
      if (VIEW_KEYS[key]) {
        e.preventDefault();
        toggleWindow(VIEW_KEYS[key]);
        return;
      }

      if (key === 'escape') {
        setSelectedLotId(null);
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleWindow]);

  // Game tick — stops when game over
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const currentlySlowed = now < slowedUntil;
      if (currentlySlowed) {
        tickSkip.current = !tickSkip.current;
        if (tickSkip.current) return;
      } else {
        tickSkip.current = false;
      }
      setGame(prev => tickHeadlines(tick(prev, now)));
    }, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [slowedUntil, isGameOver]);

  // Lot spawner — stops when game over
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => setGame(prev => spawnLot(prev)), LOT_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // AI bids — stops when game over
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now < slowedUntil) return;
      setGame(prev => aiBids(prev, now));
    }, AI_BID_INTERVAL);
    return () => clearInterval(interval);
  }, [slowedUntil, isGameOver]);

  // Terminal feed
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      msgCounter.current += 1;
      const isHeresy = Math.random() < HERESY_CHANCE;
      const msg = isHeresy
        ? generateHeresyReport(msgCounter.current)
        : generateSystemMessage(msgCounter.current);
      setMessages(prev => {
        const next = [...prev, msg];
        return next.length > 80 ? next.slice(-60) : next;
      });
      if (isHeresy) {
        const sectEffect = getSectEffect(msg.sect.id);
        const duration = sectEffect?.duration ?? HERESY_SLOWDOWN_MS;
        setSlowedUntil(Date.now() + duration);

        // Apply sect-specific market effects
        if (sectEffect) {
          setGame(prev => {
            const sentiment = { ...prev.market.sentiment };
            const classModifiers = { ...prev.market.classModifiers };

            // Apply sentiment delta to affected saints
            sectEffect.affectedSaints.forEach(saintId => {
              if (sentiment[saintId] !== undefined) {
                sentiment[saintId] = Math.max(-1, Math.min(1, sentiment[saintId] + sectEffect.sentimentDelta));
              }
            });

            // Apply class modifier effects
            Object.entries(sectEffect.classEffects).forEach(([cls, delta]) => {
              const c = Number(cls);
              classModifiers[c] = Math.max(0.5, Math.min(1.5, (classModifiers[c] ?? 1.0) + delta));
            });

            // Create a heresy headline for the media panel
            const headlineId = prev.headlineCounter + 1;
            const affectedSaint = sectEffect.affectedSaints[0];
            const saintName = prev.saints.find(s => s.id === affectedSaint)?.name ?? msg.sect.name;
            const headline = {
              id: headlineId,
              type: 'heresy' as const,
              saintId: affectedSaint ?? '',
              saintName,
              title: msg.message,
              sentimentDelta: sectEffect.sentimentDelta,
              ticksRemaining: Math.ceil(duration / 1000),
              collapseChance: 0,
            };

            return {
              ...prev,
              market: { ...prev.market, sentiment, classModifiers },
              activeHeadlines: [...prev.activeHeadlines, headline],
              headlineCounter: headlineId,
            };
          });
        }
      }
    }, FEED_INTERVAL);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Market events
  useEffect(() => {
    if (isGameOver) return;
    const scheduleNext = () => {
      const delay = 20000 + Math.random() * 20000;
      return setTimeout(() => {
        const event = generateMarketEvent();
        setGame(prev => ({ ...prev, market: applyEvent(prev.market, event) }));

        // Create a proper HerasyReport for the terminal feed
        const systemSect = { id: 'system', name: event.category.toUpperCase(), colorClass: 'text-accent', dotClass: 'bg-accent' };
        const feedMsg: HerasyReport = {
          id: Date.now(),
          sect: systemSect,
          message: `${event.title} — ${event.effect}`,
          timestamp: Date.now(),
        };
        setMessages(prev => {
          const next = [...prev, feedMsg];
          return next.length > 80 ? next.slice(-60) : next;
        });
        if (event.category === 'heresy') {
          setSlowedUntil(Date.now() + HERESY_SLOWDOWN_MS);
        }
        timerRef.current = scheduleNext();
      }, delay);
    };
    const timerRef = { current: scheduleNext() };
    return () => clearTimeout(timerRef.current);
  }, [isGameOver]);

  // Drain pending messages from engine into feed
  useEffect(() => {
    if (game.pendingMessages.length > 0) {
      const systemSect = { id: 'system', name: 'SYSTEM', colorClass: 'text-accent', dotClass: 'bg-accent' };
      const newMsgs = game.pendingMessages.map((msg, i) => ({
        id: Date.now() + i,
        sect: systemSect,
        message: msg,
        timestamp: Date.now(),
      }));
      setMessages(prev => {
        const next = [...prev, ...newMsgs];
        return next.length > 80 ? next.slice(-60) : next;
      });
      setGame(prev => ({ ...prev, pendingMessages: [] }));
    }
  }, [game.pendingMessages]);

  // Low-currency warning
  useEffect(() => {
    if (game.currency < LOW_CURRENCY_THRESHOLD && !lowCurrencyWarned.current && game.currency > 0) {
      lowCurrencyWarned.current = true;
      const systemSect = { id: 'system', name: 'SYSTEM', colorClass: 'text-destructive', dotClass: 'bg-destructive' };
      setMessages(prev => [...prev, {
        id: Date.now(),
        sect: systemSect,
        message: `[WARNING] Currency critically low — ◈${game.currency} remaining`,
        timestamp: Date.now(),
      }]);
    }
  }, [game.currency]);

  // Deselect if lot is no longer active
  useEffect(() => {
    if (selectedLotId && !game.lots.find(l => l.id === selectedLotId && (l.status === 'active' || l.status === 'closing'))) {
      setSelectedLotId(null);
    }
  }, [game.lots, selectedLotId]);

  const handleBid = useCallback((lotId: string, amount: number) => {
    setGame(prev => placeBid(prev, lotId, amount));
  }, []);

  const handleSaintDone = useCallback(() => {
    setGame(prev => ({ ...prev, completedSaint: null }));
  }, []);

  const handleSelect = useCallback((lotId: string) => {
    setSelectedLotId(lotId);
    openWindow('buy');
    bringToFront('buy');
  }, [openWindow, bringToFront]);

  const handleRestart = useCallback(() => {
    setGame(initGame());
    setSelectedLotId(null);
    setMessages([]);
    setSlowedUntil(0);
    startTimeRef.current = Date.now();
    msgCounter.current = 0;
    lowCurrencyWarned.current = false;
  }, []);

  const trackerHeight = 28;
  const titleBarHeight = 22;
  const fkeyBarHeight = 30;
  const tickerWidth = 220;

  // Calculate dock widths so the grid shrinks to accommodate docked windows
  // Left dock overlaps the ticker (x=0), so no extra width needed
  const hasRightDock = Object.values(wmState.windows).some(w => w.isOpen && w.anchor === 'right');
  const rightDockW = hasRightDock ? (Object.values(wmState.windows).find(w => w.isOpen && w.anchor === 'right')?.size.w ?? 0) : 0;

  const gridH = dims.h - trackerHeight - titleBarHeight - fkeyBarHeight;
  const gridW = dims.w - tickerWidth - rightDockW;

  const activeLots = game.lots.filter(l => l.status === 'active' || l.status === 'closing' || l.timeRemaining > -2);
  const nodes = buildBSP(activeLots, 0, 0, gridW, gridH);

  const lotMap = new Map(game.lots.map(l => [l.id, l]));
  const saintMap = new Map(game.saints.map(s => [s.id, s]));

  const selectedLot = selectedLotId ? lotMap.get(selectedLotId) ?? null : null;
  const selectedSaintProgress = selectedLot
    ? (() => {
        const s = saintMap.get(selectedLot.relic.saintId);
        return s ? { collected: s.collectedRelics.length, total: s.totalRelics } : null;
      })()
    : null;

  const netWorth = getNetWorth(game);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-cell-border bg-cell-titlebar px-2 shrink-0" style={{ height: titleBarHeight }}>
        <span className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>
          HOLY_OPS.EXE — Relic Exchange v0.1
        </span>
        {isSlowed && (
          <span className="text-accent font-mono animate-pulse" style={{ fontSize: 9 }}>
            ▓ TRIBUNAL DELAY ▓
          </span>
        )}
        <div className="flex gap-1.5">
          <div className="w-2 h-2 border border-muted-foreground" />
          <div className="w-2 h-2 border border-muted-foreground" />
          <div className="w-2 h-2 border border-muted-foreground" />
        </div>
      </div>

      {/* Saint tracker */}
      <div className="border-b border-cell-border bg-cell-titlebar shrink-0">
        <SaintTracker saints={game.saints} currency={game.currency} netWorth={netWorth} />
      </div>

      {/* Main 3-column area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Lot Ticker */}
        <LotTicker lots={game.lots} selectedLotId={selectedLotId} onSelect={handleSelect} />

        {/* Center: Market Grid — shrinks to accommodate docked panels */}
        <div className="relative overflow-hidden bg-background" style={{ width: gridW }}>
          <div className="absolute inset-0 z-0" style={{ backgroundColor: 'hsl(240 12% 4%)' }} />
          {nodes.map(node => {
            if (!node.lotId) return null;
            const lot = lotMap.get(node.lotId);
            if (!lot) return null;
            const saint = saintMap.get(lot.relic.saintId);
            const progress = saint
              ? { collected: saint.collectedRelics.length, total: saint.totalRelics }
              : { collected: 0, total: 0 };
            return (
              <GridCell
                key={lot.id}
                node={node}
                lot={lot}
                saintProgress={progress}
                isSelected={lot.id === selectedLotId}
                onSelect={handleSelect}
              />
            );
          })}
        </div>

      </div>

      {/* Compact Feed Strip */}
      <CompactFeed messages={messages} />

      {/* F-Key Navigation Bar */}
      <FKeyBar
        activeView={wmState.lastFocused ?? 'buy'}
        onViewChange={toggleWindow}
        notifications={Object.fromEntries(
          Object.values(wmState.windows).filter(w => w.isOpen).map(w => [w.id, true])
        )}
      />

      {/* Floating Windows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
        <FloatingWindow windowId="buy">
          <BidPanel lot={selectedLot} saintProgress={selectedSaintProgress} currency={game.currency} onBid={handleBid} onClose={() => setSelectedLotId(null)} />
        </FloatingWindow>
        <FloatingWindow windowId="sell">
          <SellPanel portfolio={game.portfolio} currency={game.currency} onSell={(relicId) => setGame(prev => sellRelic(prev, relicId))} />
        </FloatingWindow>
        <FloatingWindow windowId="port">
          <PortfolioPanel portfolio={game.portfolio} saints={game.saints} currency={game.currency} />
        </FloatingWindow>
        <FloatingWindow windowId="enshrine">
          <EnshrinePanel portfolio={game.portfolio} saints={game.saints} onEnshrine={(relicId) => setGame(prev => enshrineRelic(prev, relicId))} />
        </FloatingWindow>
        <FloatingWindow windowId="intel">
          <IntelPanel market={game.market} saints={game.saints} lotCount={game.lots.filter(l => l.status === 'active' || l.status === 'closing').length} />
        </FloatingWindow>
        <FloatingWindow windowId="doctrine">
          <DoctrinePanel />
        </FloatingWindow>
        <FloatingWindow windowId="log">
          <TerminalFeed messages={messages} isSlowed={isSlowed} />
        </FloatingWindow>
        <FloatingWindow windowId="sys">
          <SysPanel game={game} startTime={startTimeRef.current} onRestart={handleRestart} />
        </FloatingWindow>
        <FloatingWindow windowId="media">
          <MediaPanel
            market={game.market}
            saints={game.saints}
            activeHeadlines={game.activeHeadlines}
            currency={game.currency}
            costs={getMediaCosts(game)}
            onCommission={(saintId) => setGame(prev => commission(prev, saintId))}
            onSuppress={(headlineId) => setGame(prev => suppress(prev, headlineId))}
            onFabricate={(saintId) => setGame(prev => fabricate(prev, saintId))}
          />
        </FloatingWindow>
      </div>

      <SaintCompleteOverlay saintName={game.completedSaint} onDone={handleSaintDone} />
      {showTutorial && <TutorialOverlay onDismiss={() => setShowTutorial(false)} />}
      {game.gameOver && (
        <GameOverOverlay
          stats={{ ...game.gameOver, timePlayed: Date.now() - startTimeRef.current }}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

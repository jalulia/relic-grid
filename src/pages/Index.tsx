import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../game/types';
import { initGame, placeBid, tick, spawnLot, aiBids, TICK_INTERVAL, LOT_SPAWN_INTERVAL, AI_BID_INTERVAL } from '../game/engine';
import { buildBSP } from '../game/bsp';
import { HerasyReport, generateHeresyReport, generateSystemMessage } from '../game/heresy';
import GridCell from '../components/GridCell';
import SaintTracker from '../components/SaintTracker';
import SaintCompleteOverlay from '../components/SaintCompleteOverlay';
import LotTicker from '../components/LotTicker';
import BidPanel from '../components/BidPanel';
import Collection from '../components/Collection';
import TerminalFeed from '../components/TerminalFeed';
import TutorialOverlay from '../components/TutorialOverlay';

const HERESY_SLOWDOWN_MS = 4000;
const FEED_INTERVAL = 2500;
const HERESY_CHANCE = 0.35;

export default function Index() {
  const [game, setGame] = useState<GameState>(() => initGame());
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [messages, setMessages] = useState<HerasyReport[]>([]);
  const [slowedUntil, setSlowedUntil] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const msgCounter = useRef(0);
  const tickSkip = useRef(false);

  const isSlowed = Date.now() < slowedUntil;

  useEffect(() => {
    const handler = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const currentlySlowed = now < slowedUntil;
      if (currentlySlowed) {
        tickSkip.current = !tickSkip.current;
        if (tickSkip.current) return;
      } else {
        tickSkip.current = false;
      }
      setGame(prev => tick(prev, now));
    }, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [slowedUntil]);

  useEffect(() => {
    const interval = setInterval(() => setGame(prev => spawnLot(prev)), LOT_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now < slowedUntil) return;
      setGame(prev => aiBids(prev, now));
    }, AI_BID_INTERVAL);
    return () => clearInterval(interval);
  }, [slowedUntil]);

  useEffect(() => {
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
      if (isHeresy) setSlowedUntil(Date.now() + HERESY_SLOWDOWN_MS);
    }, FEED_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedLotId && !game.lots.find(l => l.id === selectedLotId && l.status === 'active')) {
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
    setSelectedLotId(prev => prev === lotId ? null : lotId);
  }, []);

  const handleCloseBar = useCallback(() => {
    setSelectedLotId(null);
  }, []);

  const trackerHeight = 28;
  const titleBarHeight = 22;
  const tickerWidth = 220;
  const sidebarWidth = 320;
  const gridH = dims.h - trackerHeight - titleBarHeight;
  const gridW = dims.w - tickerWidth - sidebarWidth;

  const activeLots = game.lots.filter(l => l.status === 'active' || l.timeRemaining > -2);
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
        <SaintTracker saints={game.saints} currency={game.currency} />
      </div>

      {/* Main 3-column area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Lot Ticker */}
        <LotTicker lots={game.lots} selectedLotId={selectedLotId} onSelect={handleSelect} />

        {/* Center: Market Grid */}
        <div className="relative flex-1 overflow-hidden bg-background">
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

        {/* Right: BidPanel + Terminal + Collection */}
        <div className="flex flex-col border-l border-cell-border bg-cell shrink-0" style={{ width: sidebarWidth }}>
          <BidPanel
            lot={selectedLot}
            saintProgress={selectedSaintProgress}
            currency={game.currency}
            onBid={handleBid}
            onClose={handleCloseBar}
          />
          <TerminalFeed messages={messages} isSlowed={isSlowed} />
          <Collection saints={game.saints} />
        </div>
      </div>

      <SaintCompleteOverlay saintName={game.completedSaint} onDone={handleSaintDone} />
      {showTutorial && <TutorialOverlay onDismiss={() => setShowTutorial(false)} />}
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../game/types';
import { initGame, placeBid, tick, spawnLot, aiBids, TICK_INTERVAL, LOT_SPAWN_INTERVAL, AI_BID_INTERVAL } from '../game/engine';
import { buildBSP } from '../game/bsp';
import GridCell from '../components/GridCell';
import SaintTracker from '../components/SaintTracker';
import SaintCompleteOverlay from '../components/SaintCompleteOverlay';
import BidBar from '../components/BidBar';

export default function Index() {
  const [game, setGame] = useState<GameState>(() => initGame());
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });

  // Handle resize
  useEffect(() => {
    const handler = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Game tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGame(prev => tick(prev, Date.now()));
    }, TICK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Spawn new lots
  useEffect(() => {
    const interval = setInterval(() => {
      setGame(prev => spawnLot(prev));
    }, LOT_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // AI bids
  useEffect(() => {
    const interval = setInterval(() => {
      setGame(prev => aiBids(prev, Date.now()));
    }, AI_BID_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Clear selection if lot is gone
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
  const bidBarHeight = 36;
  const gridH = dims.h - trackerHeight - titleBarHeight - bidBarHeight;
  const gridW = dims.w;

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

      {/* Grid */}
      <div className="relative flex-1 overflow-hidden">
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

      {/* Bid bar */}
      <div className="shrink-0">
        <BidBar
          lot={selectedLot}
          saintProgress={selectedSaintProgress}
          currency={game.currency}
          onBid={handleBid}
          onClose={handleCloseBar}
        />
      </div>

      <SaintCompleteOverlay saintName={game.completedSaint} onDone={handleSaintDone} />
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../game/types';
import { initGame, placeBid, tick, spawnLot, aiBids, TICK_INTERVAL, LOT_SPAWN_INTERVAL, AI_BID_INTERVAL } from '../game/engine';
import { buildBSP } from '../game/bsp';
import GridCell from '../components/GridCell';
import SaintTracker from '../components/SaintTracker';
import SaintCompleteOverlay from '../components/SaintCompleteOverlay';

export default function Index() {
  const [game, setGame] = useState<GameState>(() => initGame());
  const gameRef = useRef(game);
  gameRef.current = game;

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

  const handleBid = useCallback((lotId: string, amount: number) => {
    setGame(prev => placeBid(prev, lotId, amount));
  }, []);

  const handleSaintDone = useCallback(() => {
    setGame(prev => ({ ...prev, completedSaint: null }));
  }, []);

  // Build BSP layout
  const activeLots = game.lots.filter(l => l.status === 'active' || l.timeRemaining > -2);
  const trackerHeight = 28;
  const titleBarHeight = 24;
  const gridH = typeof window !== 'undefined' ? window.innerHeight - trackerHeight - titleBarHeight : 800;
  const gridW = typeof window !== 'undefined' ? window.innerWidth : 1200;

  const nodes = buildBSP(activeLots, 0, 0, gridW, gridH);

  const lotMap = new Map(game.lots.map(l => [l.id, l]));
  const saintMap = new Map(game.saints.map(s => [s.id, s]));

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Window chrome title bar */}
      <div className="flex items-center justify-between border-b border-cell-border bg-cell-titlebar px-2" style={{ height: titleBarHeight }}>
        <span className="text-muted-foreground font-mono" style={{ fontSize: 11 }}>
          HOLY_OPS.EXE — Relic Exchange v0.1
        </span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 border border-muted-foreground" />
          <div className="w-2.5 h-2.5 border border-muted-foreground" />
          <div className="w-2.5 h-2.5 border border-muted-foreground" />
        </div>
      </div>

      {/* Saint tracker */}
      <div className="border-b border-cell-border bg-cell-titlebar">
        <SaintTracker saints={game.saints} currency={game.currency} />
      </div>

      {/* Grid */}
      <div className="relative flex-1">
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
              onBid={handleBid}
              canBid={game.currency > 0}
            />
          );
        })}
      </div>

      <SaintCompleteOverlay saintName={game.completedSaint} onDone={handleSaintDone} />
    </div>
  );
}

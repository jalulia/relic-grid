import React, { memo, useMemo } from 'react';
import { GameState } from '../game/types';

interface SysPanelProps {
  game: GameState;
  startTime: number;
  onRestart?: () => void;
}

const SysPanel = memo(({ game, startTime, onRestart }: SysPanelProps) => {
  const elapsed = useMemo(() => {
    const s = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }, [startTime]);

  const lotsWon = game.portfolio.length + game.saints.reduce((s, saint) => s + saint.collectedRelics.length, 0);
  const completedSaints = game.saints.filter(s => s.collectedRelics.length === s.totalRelics).length;
  const netWorth = game.currency + game.portfolio.reduce((s, p) => s + p.marketPrice, 0);

  const rows = [
    ['VERSION', 'HOLY_OPS.EXE v0.2'],
    ['SESSION', elapsed],
    ['NET WORTH', `◈ ${netWorth}`],
    ['CASH', `◈ ${game.currency}`],
    ['HOLDINGS', `${game.portfolio.length} relics`],
    ['RELICS WON', `${lotsWon}`],
    ['SAINTS COMPLETE', `${completedSaints}/8`],
    ['ACTIVE LOTS', `${game.lots.filter(l => l.status === 'active').length}`],
    ['MARKET EVENTS', `${game.market.activeEvents.length} active`],
    ['MARKET TEMP', `${game.market.globalTemp.toFixed(2)}x`],
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-2 py-1.5 border-b border-cell-border shrink-0">
        <span className="text-[9px] text-muted-foreground font-mono" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
          SYSTEM STATUS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between items-center px-2 py-1 border-b border-cell-border">
            <span className="text-[8px] text-muted-foreground font-mono" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {label}
            </span>
            <span className="text-[9px] text-foreground font-mono" style={{ fontWeight: 500 }}>
              {value}
            </span>
          </div>
        ))}

        {/* Keyboard shortcuts */}
        <div className="px-2 py-1.5 mt-2">
          <div className="text-[8px] text-muted-foreground font-mono mb-1" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            CONTROLS
          </div>
          {[
            ['B / S / P / N', 'BUY / SELL / PORT / ENSHRINE'],
            ['I / D / L / Y', 'INTEL / DOCTRINE / LOG / SYS'],
            ['M', 'MEDIA'],
            ['1 / 2 / 3', 'QUICK BID +10 / +50 / +100'],
            ['ENTER', 'CONFIRM BID'],
            ['ESC', 'DESELECT LOT'],
            ['J / K', 'NAVIGATE LOTS'],
          ].map(([key, desc]) => (
            <div key={key} className="flex justify-between py-0.5">
              <span className="text-[8px] text-accent font-mono" style={{ fontWeight: 600 }}>{key}</span>
              <span className="text-[8px] text-muted-foreground font-mono">{desc}</span>
            </div>
          ))}
          <div className="flex justify-between py-0.5">
            <span className="text-[8px] text-accent font-mono" style={{ fontWeight: 600 }}>?</span>
            <span className="text-[8px] text-muted-foreground font-mono">REOPEN TUTORIAL</span>
          </div>
        </div>

        {onRestart && (
          <div className="px-2 py-2 mt-1 border-t border-cell-border">
            <button
              onClick={onRestart}
              className="w-full text-[8px] text-muted-foreground font-mono border border-cell-border py-1 hover:text-foreground hover:border-foreground transition-colors"
              style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, background: 'none', cursor: 'pointer' }}
            >
              NEW SESSION
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

SysPanel.displayName = 'SysPanel';
export default SysPanel;

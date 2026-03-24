import React, { memo } from 'react';
import { PortfolioItem, Saint } from '../game/types';
import { getRelicImage } from '../game/relicImages';

interface EnshrinePanelProps {
  portfolio: PortfolioItem[];
  saints: Saint[];
  onEnshrine: (relicId: string) => void;
}

const EnshrinePanel = memo(({ portfolio, saints, onEnshrine }: EnshrinePanelProps) => {
  const totalEnshrined = saints.reduce((s, saint) => s + saint.collectedRelics.length, 0);
  const totalRelics = saints.reduce((s, saint) => s + saint.totalRelics, 0);
  const completedSaints = saints.filter(s => s.collectedRelics.length === s.totalRelics);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-2 py-1.5 border-b border-cell-border shrink-0">
        <div className="flex justify-between items-baseline">
          <span className="text-[9px] text-muted-foreground font-mono" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            ENSHRINE — LOCK RELICS
          </span>
          <span className="text-[9px] text-primary font-mono" style={{ fontWeight: 600 }}>
            {totalEnshrined}/{totalRelics}
          </span>
        </div>
        {completedSaints.length > 0 && (
          <div className="text-[8px] text-success font-mono mt-0.5">
            {completedSaints.length} SAINT{completedSaints.length > 1 ? 'S' : ''} COMPLETE
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {saints.map(saint => {
          const heldRelics = portfolio.filter(p => p.relic.saintId === saint.id);
          const enshrined = saint.collectedRelics;
          const progress = enshrined.length / saint.totalRelics;
          const isComplete = enshrined.length === saint.totalRelics;

          return (
            <div key={saint.id} className="border-b border-cell-border">
              {/* Saint header with progress bar */}
              <div className="px-2 py-1.5 bg-cell/20">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[9px] font-mono ${isComplete ? 'text-success' : 'text-foreground'}`} style={{ fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {isComplete ? '✦ ' : ''}{saint.name}
                  </span>
                  <span className="text-[8px] text-muted-foreground font-mono">
                    {enshrined.length}/{saint.totalRelics}
                    {heldRelics.length > 0 ? ` (+${heldRelics.length} held)` : ''}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-[3px] bg-cell-border" style={{ width: '100%' }}>
                  <div
                    className={isComplete ? 'bg-success' : 'bg-primary'}
                    style={{ width: `${progress * 100}%`, height: '100%', transition: 'width 0.3s ease' }}
                  />
                </div>
              </div>

              {/* Enshrined relics */}
              {enshrined.length > 0 && (
                <div className="px-2 py-1 flex flex-wrap gap-1">
                  {enshrined.map(relic => (
                    <div key={relic.id} className="relative group" style={{ width: 20, height: 20 }}>
                      <img
                        src={getRelicImage(relic.id)}
                        alt={relic.name}
                        className="w-full h-full object-contain"
                        style={{ filter: 'drop-shadow(0 0 2px hsl(45 100% 50% / 0.3))' }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-background border border-cell-border px-1 py-0.5 text-[7px] text-foreground font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-30">
                        {relic.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Held relics available to enshrine */}
              {heldRelics.map(item => (
                <div key={item.relic.id} className="flex items-center gap-2 px-2 py-1 hover:bg-cell/30">
                  <img
                    src={getRelicImage(item.relic.id)}
                    alt={item.relic.name}
                    className="w-5 h-5 object-contain shrink-0"
                    style={{ opacity: 0.7 }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[8px] text-foreground font-mono truncate" style={{ fontWeight: 500 }}>
                      {item.relic.name}
                    </div>
                    <div className="text-[7px] text-muted-foreground font-mono">
                      Market ◈{item.marketPrice} · Cost ◈{item.purchasePrice}
                    </div>
                  </div>
                  <button
                    onClick={() => onEnshrine(item.relic.id)}
                    className="text-[7px] text-primary font-mono px-1.5 border border-primary/30 hover:bg-primary/10 shrink-0"
                    style={{ height: 16, letterSpacing: '0.04em', fontWeight: 600 }}
                  >
                    ENSHRINE
                  </button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});

EnshrinePanel.displayName = 'EnshrinePanel';
export default EnshrinePanel;

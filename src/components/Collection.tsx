import { memo } from 'react';
import { Saint, PortfolioItem } from '../game/types';
import { getRelicImage } from '../game/relicImages';

interface CollectionProps {
  saints: Saint[];
  portfolio: PortfolioItem[];
  onEnshrine: (relicId: string) => void;
  onSell?: (relicId: string) => void;
}

const Collection = memo(({ saints, portfolio, onEnshrine, onSell }: CollectionProps) => {
  const activeSaints = saints.filter(s => s.collectedRelics.length > 0);

  return (
    <div className="flex flex-col border-t border-cell-border bg-cell shrink-0 overflow-hidden" style={{ height: 200 }}>

      {/* PORTFOLIO: tradeable relics */}
      <div className="flex items-center bg-cell-titlebar px-2 border-b border-cell-border" style={{ height: 16 }}>
        <span className="text-[9px] text-accent font-mono">▶ PORTFOLIO ({portfolio.length} held)</span>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 90 }}>
        {portfolio.length === 0 ? (
          <div className="text-muted-foreground font-mono text-[9px] text-center py-2">
            Win auctions to acquire relics
          </div>
        ) : (
          <div className="flex flex-col">
            {portfolio.map(item => (
              <div
                key={item.relic.id}
                className="flex items-center gap-1.5 px-2 py-1 border-b border-cell-border/30 hover:bg-cell-titlebar"
              >
                <img
                  src={getRelicImage(item.relic.id)}
                  alt={item.relic.name}
                  className="object-contain shrink-0"
                  style={{ width: 18, height: 18, filter: 'drop-shadow(0 0 2px hsl(45 100% 50% / 0.3))' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[8px] text-foreground font-mono truncate" style={{ fontWeight: 600 }}>
                    {item.relic.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[7px] text-muted-foreground font-mono">
                      {item.relic.saintName}
                    </span>
                    <span className="text-[7px] text-muted-foreground font-mono">◈{item.purchasePrice}</span>
                    <span className="text-[7px] font-mono" style={{ fontWeight: 600 }}>
                      →
                    </span>
                    <span className={`text-[7px] font-mono ${item.marketPrice >= item.purchasePrice ? 'text-success' : 'text-destructive'}`} style={{ fontWeight: 600 }}>
                      ◈{item.marketPrice}
                    </span>
                    <span className={`text-[6px] font-mono ${item.marketPrice >= item.purchasePrice ? 'text-success' : 'text-destructive'}`}>
                      {item.marketPrice >= item.purchasePrice ? '+' : ''}{Math.round((item.marketPrice - item.purchasePrice) / item.purchasePrice * 100)}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 shrink-0">
                  {onSell && (
                    <button
                      onClick={() => onSell(item.relic.id)}
                      className="text-[7px] text-accent font-mono px-1.5 border border-accent/30 hover:bg-accent/10"
                      style={{ height: 14, letterSpacing: 0.5, fontWeight: 600 }}
                    >
                      SELL ◈{item.marketPrice}
                    </button>
                  )}
                  <button
                    onClick={() => onEnshrine(item.relic.id)}
                    className="text-[7px] text-primary font-mono px-1.5 border border-primary/30 hover:bg-primary/10"
                    style={{ height: 14, letterSpacing: 0.5, fontWeight: 600 }}
                  >
                    ENSHRINE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COLLECTION: enshrined relics */}
      <div className="flex items-center bg-cell-titlebar px-2 border-b border-cell-border" style={{ height: 16 }}>
        <span className="text-[9px] text-success font-mono">▶ ENSHRINED ({activeSaints.reduce((a, s) => a + s.collectedRelics.length, 0)})</span>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5">
        {activeSaints.length === 0 ? (
          <div className="text-muted-foreground font-mono text-[9px] text-center py-1">
            Enshrine relics to lock into collection
          </div>
        ) : (
          activeSaints.map(saint => (
            <div key={saint.id} className="mb-1.5">
              <div className="text-[9px] text-muted-foreground font-mono mb-0.5">
                {saint.name} ({saint.collectedRelics.length}/{saint.totalRelics})
              </div>
              <div className="flex flex-wrap gap-1">
                {saint.collectedRelics.map((relic) => {
                  return (
                    <div
                      key={relic.id}
                      className="relative group"
                      style={{ width: 24, height: 24 }}
                    >
                      <img
                        src={getRelicImage(relic.id)}
                        alt={relic.name}
                        className="w-full h-full object-contain"
                        style={{ filter: 'drop-shadow(0 0 2px hsl(45 100% 50% / 0.3))' }}
                      />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-background border border-cell-border px-1 py-0.5 text-[8px] text-foreground font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-30">
                        {relic.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

Collection.displayName = 'Collection';

export default Collection;

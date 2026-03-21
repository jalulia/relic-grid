import { memo, useRef, useEffect } from 'react';
import { Lot } from '../game/types';

interface LotTickerProps {
  lots: Lot[];
  selectedLotId: string | null;
  onSelect: (lotId: string) => void;
}

function getStatusInfo(lot: Lot) {
  if (lot.yourBid !== null && lot.yourBid >= lot.currentBid) return { label: 'WIN', cls: 'text-success' };
  if (lot.yourBid !== null && lot.yourBid < lot.currentBid) return { label: 'OUTBID', cls: 'text-destructive' };
  if (lot.timeRemaining < 15) return { label: 'ENDING', cls: 'text-accent' };
  return { label: '', cls: '' };
}

function formatTime(s: number): string {
  const t = Math.max(0, s);
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

const LotTicker = memo(({ lots, selectedLotId, onSelect }: LotTickerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeLots = lots.filter(l => l.status === 'active');
  const yourBids = activeLots.filter(l => l.yourBid !== null).sort((a, b) => a.timeRemaining - b.timeRemaining);
  const allLots = activeLots.sort((a, b) => a.timeRemaining - b.timeRemaining);

  return (
    <div className="flex flex-col border-r border-cell-border bg-cell shrink-0 overflow-hidden" style={{ width: 220 }}>
      {/* Your Bids section */}
      <div className="shrink-0">
        <div className="flex items-center bg-cell-titlebar px-2 border-b border-cell-border" style={{ height: 16 }}>
          <span className="text-[9px] text-accent font-mono">▶ YOUR BIDS ({yourBids.length})</span>
        </div>
        {yourBids.length === 0 ? (
          <div className="px-2 py-2 text-[9px] text-muted-foreground font-mono">No active bids</div>
        ) : (
          <div className="max-h-40 overflow-y-auto">
            {yourBids.map(lot => {
              const status = getStatusInfo(lot);
              const isSelected = lot.id === selectedLotId;
              return (
                <div
                  key={lot.id}
                  className={`flex items-center gap-1 px-2 cursor-pointer hover:bg-secondary font-mono ${
                    isSelected ? 'bg-secondary border-l-2 border-l-accent' : 'border-l-2 border-l-transparent'
                  }`}
                  style={{ height: 26, fontSize: 9 }}
                  onClick={() => onSelect(lot.id)}
                >
                  <span className="text-muted-foreground w-14 shrink-0 truncate">{lot.id}</span>
                  <span className="text-foreground truncate flex-1">{lot.relic.name}</span>
                  <span className={`shrink-0 ${status.cls}`}>{status.label}</span>
                  <span className={`shrink-0 w-10 text-right ${lot.timeRemaining < 30 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {formatTime(lot.timeRemaining)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Lots section */}
      <div className="flex items-center bg-cell-titlebar px-2 border-y border-cell-border" style={{ height: 16 }}>
        <span className="text-[9px] text-muted-foreground font-mono">ALL LOTS ({allLots.length})</span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {allLots.map(lot => {
          const status = getStatusInfo(lot);
          const isSelected = lot.id === selectedLotId;
          const hasBid = lot.yourBid !== null;
          return (
            <div
              key={lot.id}
              className={`flex items-center gap-1 px-2 cursor-pointer hover:bg-secondary font-mono ${
                isSelected ? 'bg-secondary border-l-2 border-l-accent' : hasBid ? 'border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'
              }`}
              style={{ height: 24, fontSize: 9 }}
              onClick={() => onSelect(lot.id)}
            >
              <span className="text-muted-foreground w-14 shrink-0 truncate">{lot.id}</span>
              <span className="text-foreground truncate flex-1">{lot.relic.name}</span>
              <span className="text-muted-foreground shrink-0">◈{lot.currentBid}</span>
              {status.label && <span className={`shrink-0 ${status.cls}`}>{status.label}</span>}
              <span className={`shrink-0 w-10 text-right ${lot.timeRemaining < 30 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {formatTime(lot.timeRemaining)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

LotTicker.displayName = 'LotTicker';

export default LotTicker;

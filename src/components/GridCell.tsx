import { useState, useCallback, memo } from 'react';
import { BSPNode, Lot } from '../game/types';

interface GridCellProps {
  node: BSPNode;
  lot: Lot;
  saintProgress: { collected: number; total: number };
  onBid: (lotId: string, amount: number) => void;
  canBid: boolean;
}

function getStatusColor(lot: Lot): string {
  if (lot.yourBid !== null && lot.yourBid >= lot.currentBid) return 'text-success';
  if (lot.yourBid !== null && lot.yourBid < lot.currentBid) return 'text-destructive';
  if (lot.timeRemaining < 15) return 'text-accent';
  return 'text-foreground';
}

function getStatusDot(lot: Lot): string {
  if (lot.yourBid !== null && lot.yourBid >= lot.currentBid) return 'bg-success';
  if (lot.yourBid !== null && lot.yourBid < lot.currentBid) return 'bg-destructive';
  if (lot.timeRemaining < 15) return 'bg-accent';
  return 'bg-muted-foreground';
}

const GridCell = memo(({ node, lot, saintProgress, onBid, canBid }: GridCellProps) => {
  const [bidding, setBidding] = useState(false);
  const [bidValue, setBidValue] = useState('');

  const isSmall = node.w < 200 || node.h < 120;
  const isTiny = node.w < 140 || node.h < 80;
  const isLarge = node.w > 300 && node.h > 180;

  const handleClick = useCallback(() => {
    if (lot.status !== 'active' || !canBid) return;
    setBidding(true);
    setBidValue(String(lot.currentBid + 10));
  }, [lot.status, lot.currentBid, canBid]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const amount = parseInt(bidValue);
    if (!isNaN(amount) && amount > lot.currentBid) {
      onBid(lot.id, amount);
    }
    setBidding(false);
    setBidValue('');
  }, [bidValue, lot.id, lot.currentBid, onBid]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setBidding(false);
      setBidValue('');
    }
  }, []);

  const timeStr = `${String(Math.floor(lot.timeRemaining / 60)).padStart(2, '0')}:${String(lot.timeRemaining % 60).padStart(2, '0')}`;
  const flashClass = lot.flash === 'outbid' ? 'cell-flash-outbid' : lot.flash === 'win' ? 'cell-flash-win' : '';

  return (
    <div
      className={`absolute overflow-hidden border border-cell-border bg-cell cursor-pointer select-none ${flashClass}`}
      style={{
        left: node.x,
        top: node.y,
        width: node.w,
        height: node.h,
        transition: 'left 400ms ease, top 400ms ease, width 400ms ease, height 400ms ease',
      }}
      onClick={!bidding ? handleClick : undefined}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between bg-cell-titlebar px-1.5 py-0" style={{ height: 18 }}>
        <span className="text-[9px] text-muted-foreground truncate">{lot.id}</span>
        <div className="flex gap-0.5 items-center">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(lot)}`} />
        </div>
      </div>

      {/* Content */}
      <div className="p-1.5 flex flex-col gap-0.5" style={{ fontSize: isTiny ? 9 : isSmall ? 10 : 11 }}>
        {!isTiny && (
          <div className="text-foreground font-mono truncate" style={{ fontSize: isSmall ? 10 : 12 }}>
            {lot.relic.name}
          </div>
        )}

        <div className="text-muted-foreground truncate">
          {lot.relic.saintName} [{saintProgress.collected}/{saintProgress.total}]
        </div>

        {isLarge && (
          <>
            <div className="text-muted-foreground text-[9px]">Class {lot.relic.relicClass === 1 ? 'I' : lot.relic.relicClass === 2 ? 'II' : 'III'}</div>
            <div className="text-muted-foreground text-[9px] truncate">{lot.relic.provenance}</div>
          </>
        )}

        <div className="flex items-center gap-2 mt-0.5">
          <span className={getStatusColor(lot)}>◈ {lot.currentBid}</span>
          {lot.yourBid !== null && lot.yourBid < lot.currentBid && (
            <span className="text-destructive text-[9px]">yours: ◈ {lot.yourBid}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`font-mono ${lot.timeRemaining < 30 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {timeStr}
          </span>
          {!isSmall && <span className="text-muted-foreground text-[9px]">{lot.bidCount} bids</span>}
        </div>

        {bidding && (
          <form onSubmit={handleSubmit} className="mt-1 flex gap-1" onClick={e => e.stopPropagation()}>
            <input
              type="number"
              value={bidValue}
              onChange={e => setBidValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-input border border-cell-border text-foreground px-1 py-0 font-mono w-full"
              style={{ fontSize: 10, height: 20 }}
              min={lot.currentBid + 1}
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-1.5 font-mono"
              style={{ fontSize: 9, height: 20 }}
            >
              BID
            </button>
          </form>
        )}
      </div>
    </div>
  );
});

GridCell.displayName = 'GridCell';

export default GridCell;

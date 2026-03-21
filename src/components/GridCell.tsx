import { memo } from 'react';
import { BSPNode, Lot } from '../game/types';

interface GridCellProps {
  node: BSPNode;
  lot: Lot;
  saintProgress: { collected: number; total: number };
  isSelected: boolean;
  onSelect: (lotId: string) => void;
}

function getStatusDot(lot: Lot): string {
  if (lot.yourBid !== null && lot.yourBid >= lot.currentBid) return 'bg-success';
  if (lot.yourBid !== null && lot.yourBid < lot.currentBid) return 'bg-destructive';
  if (lot.timeRemaining < 15) return 'bg-accent';
  return 'bg-muted-foreground';
}

function getStatusColor(lot: Lot): string {
  if (lot.yourBid !== null && lot.yourBid >= lot.currentBid) return 'text-success';
  if (lot.yourBid !== null && lot.yourBid < lot.currentBid) return 'text-destructive';
  if (lot.timeRemaining < 15) return 'text-accent';
  return 'text-foreground';
}

const GridCell = memo(({ node, lot, saintProgress, isSelected, onSelect }: GridCellProps) => {
  const isSmall = node.w < 200 || node.h < 110;
  const isTiny = node.w < 150 || node.h < 90;
  const isLarge = node.w > 300 && node.h > 160;

  const timeStr = `${String(Math.floor(lot.timeRemaining / 60)).padStart(2, '0')}:${String(Math.max(0, lot.timeRemaining) % 60).padStart(2, '0')}`;
  const flashClass = lot.flash === 'outbid' ? 'cell-flash-outbid' : lot.flash === 'win' ? 'cell-flash-win' : '';

  return (
    <div
      className={`absolute overflow-hidden border bg-cell cursor-pointer select-none ${flashClass} ${
        isSelected ? 'border-accent z-10' : 'border-cell-border'
      }`}
      style={{
        left: node.x,
        top: node.y,
        width: node.w,
        height: node.h,
        transition: 'left 600ms ease, top 600ms ease, width 600ms ease, height 600ms ease',
        borderWidth: isSelected ? 2 : 1,
      }}
      onClick={() => onSelect(lot.id)}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between bg-cell-titlebar px-1.5" style={{ height: 16 }}>
        <span className="text-[9px] text-muted-foreground truncate">{lot.id}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(lot)}`} />
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
            <div className="text-muted-foreground text-[9px]">
              Class {lot.relic.relicClass === 1 ? 'I' : lot.relic.relicClass === 2 ? 'II' : 'III'}
            </div>
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
      </div>
    </div>
  );
});

GridCell.displayName = 'GridCell';

export default GridCell;

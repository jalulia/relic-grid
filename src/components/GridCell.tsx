import { memo, useMemo } from 'react';
import { BSPNode, Lot } from '../game/types';
import { getRelicImage } from '../game/relicImages';
import { playWololo } from '../game/audio';

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
  return '';
}

function getStatusColor(lot: Lot): string {
  if (lot.yourBid !== null && lot.yourBid >= lot.currentBid) return 'text-success';
  if (lot.yourBid !== null && lot.yourBid < lot.currentBid) return 'text-destructive';
  if (lot.timeRemaining < 15) return 'text-accent';
  return 'text-foreground';
}

// ~5% of cells get a wololo monk
function hashNum(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const GridCell = memo(({ node, lot, saintProgress, isSelected, onSelect }: GridCellProps) => {
  const isSmall = node.w < 200 || node.h < 120;
  const isTiny = node.w < 150 || node.h < 90;

  const timeStr = `${String(Math.floor(Math.max(0, lot.timeRemaining) / 60)).padStart(2, '0')}:${String(Math.max(0, lot.timeRemaining) % 60).padStart(2, '0')}`;
  const flashClass = lot.flash === 'outbid' ? 'cell-flash-outbid' : lot.flash === 'win' ? 'cell-flash-win' : '';
  const relicImage = getRelicImage(lot.relic.id);
  const statusDot = getStatusDot(lot);

  // Show relic in all cells, scaled to fit as background watermark
  const imgSize = Math.min(node.w * 0.55, node.h * 0.65, 80);

  // Rare wololo monk (~5% of cells)
  const hasWololo = useMemo(() => hashNum(lot.id) % 20 === 0, [lot.id]);

  const handleClick = (e: React.MouseEvent) => {
    onSelect(lot.id);
    // If this cell has a wololo, play the sound
    if (hasWololo) {
      e.stopPropagation();
      playWololo();
    }
  };

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
      onClick={handleClick}
    >
      {/* Left edge status dot */}
      {statusDot && (
        <div
          className={`absolute left-0 z-20 ${statusDot}`}
          style={{
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            boxShadow: '0 0 6px currentColor',
          }}
        />
      )}

      {/* Title bar */}
      <div className="flex items-center justify-between bg-cell-titlebar px-1.5" style={{ height: 16 }}>
        <span className="text-[9px] text-muted-foreground truncate">{lot.id}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${statusDot || 'bg-muted-foreground'}`} />
      </div>

      {/* Content with image */}
      <div className="relative flex-1 p-1.5" style={{ height: node.h - 16 }}>
        <div className="flex flex-col gap-0.5 relative z-10" style={{ fontSize: isTiny ? 9 : isSmall ? 10 : 11 }}>
          {!isTiny && (
            <div className="text-foreground font-mono truncate" style={{ fontSize: isSmall ? 10 : 13, fontWeight: 700 }}>
              {lot.relic.name}
            </div>
          )}

          <div className="text-muted-foreground truncate">
            {lot.relic.saintName} [{saintProgress.collected}/{saintProgress.total}]
          </div>

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

        {/* Relic background watermark — always visible */}
        <img
          src={relicImage}
          alt=""
          className="absolute pointer-events-none"
          style={{
            bottom: 2,
            right: 2,
            width: imgSize,
            height: imgSize,
            objectFit: 'contain',
            opacity: 0.18,
            filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4)) saturate(0.6)',
          }}
        />

        {/* Rare wololo monk */}
        {hasWololo && node.w > 100 && node.h > 80 && (
          <img
            src="/images/relics/aoe-wolo.gif"
            alt=""
            className="absolute z-20 cursor-pointer"
            style={{
              bottom: 4,
              left: 4,
              width: 24,
              height: 24,
              opacity: 0.6,
              imageRendering: 'pixelated',
            }}
            onClick={(e) => {
              e.stopPropagation();
              playWololo();
            }}
          />
        )}
      </div>
    </div>
  );
});

GridCell.displayName = 'GridCell';

export default GridCell;

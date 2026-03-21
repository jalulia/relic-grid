import { useState, useCallback, useEffect, useRef } from 'react';
import { Lot } from '../game/types';

interface BidBarProps {
  lot: Lot | null;
  saintProgress: { collected: number; total: number } | null;
  currency: number;
  onBid: (lotId: string, amount: number) => void;
  onClose: () => void;
}

export default function BidBar({ lot, saintProgress, currency, onBid, onClose }: BidBarProps) {
  const [bidValue, setBidValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lot) {
      setBidValue(String(lot.currentBid + 10));
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [lot?.id, lot?.currentBid]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!lot) return;
    const amount = parseInt(bidValue);
    if (!isNaN(amount) && amount > lot.currentBid && amount <= currency) {
      onBid(lot.id, amount);
    }
  }, [bidValue, lot, currency, onBid]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!lot) {
    return (
      <div className="flex items-center justify-center px-3 border-t border-cell-border bg-cell-titlebar"
        style={{ height: 36, fontSize: 10 }}>
        <span className="text-muted-foreground font-mono">Click a lot to bid · ◈ {currency} available</span>
      </div>
    );
  }

  const isWinning = lot.yourBid !== null && lot.yourBid >= lot.currentBid;
  const isOutbid = lot.yourBid !== null && lot.yourBid < lot.currentBid;

  return (
    <div className="flex items-center gap-3 px-3 border-t border-accent bg-cell-titlebar"
      style={{ height: 36, fontSize: 11 }}>

      <span className="text-accent font-mono">{lot.id}</span>
      <span className="text-foreground font-mono truncate max-w-48">{lot.relic.name}</span>
      <span className="text-muted-foreground">
        {lot.relic.saintName} [{saintProgress?.collected}/{saintProgress?.total}]
      </span>

      <span className="text-muted-foreground">│</span>

      <span className="text-foreground">◈ {lot.currentBid}</span>

      {isWinning && <span className="text-success text-[10px]">WINNING</span>}
      {isOutbid && <span className="text-destructive text-[10px]">OUTBID</span>}

      <span className="text-muted-foreground">│</span>

      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <span className="text-muted-foreground">◈</span>
        <input
          ref={inputRef}
          type="number"
          value={bidValue}
          onChange={e => setBidValue(e.target.value)}
          className="bg-input border border-cell-border text-foreground px-1.5 py-0 font-mono"
          style={{ fontSize: 11, height: 22, width: 80 }}
          min={lot.currentBid + 1}
          max={currency}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-3 font-mono hover:brightness-110"
          style={{ fontSize: 10, height: 22, letterSpacing: 1 }}
        >
          BID
        </button>
      </form>

      <span className="text-muted-foreground text-[9px] ml-auto">
        ◈ {currency} avail · ESC to close
      </span>
    </div>
  );
}

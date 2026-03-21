import { useState, useCallback, useEffect, useRef } from 'react';
import { Lot } from '../game/types';

interface BidPanelProps {
  lot: Lot | null;
  saintProgress: { collected: number; total: number } | null;
  currency: number;
  onBid: (lotId: string, amount: number) => void;
  onClose: () => void;
}

export default function BidPanel({ lot, saintProgress, currency, onBid, onClose }: BidPanelProps) {
  const [bidValue, setBidValue] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lot) {
      setBidValue(String(lot.currentBid + 10));
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    setConfirm(null);
  }, [lot?.id, lot?.currentBid]);

  const doBid = useCallback((amount: number) => {
    if (!lot) return;
    if (amount > lot.currentBid && amount <= currency) {
      onBid(lot.id, amount);
      setConfirm(`BID PLACED ◈ ${amount}`);
      setTimeout(() => setConfirm(null), 2000);
    }
  }, [lot, currency, onBid]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    doBid(parseInt(bidValue));
  }, [bidValue, doBid]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const isWinning = lot?.yourBid !== null && lot?.yourBid !== undefined && lot.yourBid >= lot.currentBid;
  const isOutbid = lot?.yourBid !== null && lot?.yourBid !== undefined && lot.yourBid < lot.currentBid;

  if (!lot) {
    return (
      <div className="flex flex-col items-center justify-center border-b border-cell-border bg-cell-titlebar shrink-0 px-3" style={{ height: 140 }}>
        <span className="text-muted-foreground font-mono text-[10px]">Select a lot to bid</span>
        <span className="text-accent font-mono text-[11px] mt-1">◈ {currency}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-b border-cell-border bg-cell shrink-0 px-3 py-2 gap-1.5" style={{ height: 140 }}>
      {/* Lot info */}
      <div className="flex items-center justify-between">
        <span className="text-accent font-mono text-[10px]">{lot.id}</span>
        <div className="flex items-center gap-1.5">
          {isWinning && <span className="text-success text-[9px] font-mono">● WINNING</span>}
          {isOutbid && <span className="text-destructive text-[9px] font-mono animate-pulse">● OUTBID</span>}
        </div>
      </div>

      <div className="text-foreground font-mono text-[11px] font-bold truncate">{lot.relic.name}</div>
      <div className="text-muted-foreground text-[9px] font-mono truncate">
        {lot.relic.saintName} [{saintProgress?.collected}/{saintProgress?.total}]
      </div>

      {/* Current bid */}
      <div className="flex items-center justify-between">
        <span className="text-foreground font-mono text-[12px]">◈ {lot.currentBid}</span>
        <span className={`font-mono text-[10px] ${lot.timeRemaining < 30 ? 'text-destructive' : 'text-muted-foreground'}`}>
          {String(Math.floor(Math.max(0, lot.timeRemaining) / 60)).padStart(2, '0')}:{String(Math.max(0, lot.timeRemaining) % 60).padStart(2, '0')}
        </span>
      </div>

      {/* Quick bid buttons */}
      <div className="flex gap-1">
        {[10, 50, 100].map(inc => (
          <button
            key={inc}
            className="flex-1 bg-secondary text-foreground font-mono hover:bg-primary hover:text-primary-foreground"
            style={{ fontSize: 10, height: 22 }}
            onClick={() => doBid(lot.currentBid + inc)}
          >
            +{inc}
          </button>
        ))}
      </div>

      {/* Manual bid */}
      <form onSubmit={handleSubmit} className="flex gap-1">
        <input
          ref={inputRef}
          type="number"
          value={bidValue}
          onChange={e => setBidValue(e.target.value)}
          className="flex-1 bg-input border border-cell-border text-foreground px-1.5 font-mono"
          style={{ fontSize: 10, height: 22 }}
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

      {/* Confirmation / currency */}
      <div className="flex items-center justify-between" style={{ fontSize: 9 }}>
        {confirm ? (
          <span className="text-success font-mono animate-pulse">{confirm}</span>
        ) : (
          <span className="text-muted-foreground font-mono">◈ {currency} avail</span>
        )}
        <span className="text-muted-foreground font-mono">ESC close</span>
      </div>
    </div>
  );
}

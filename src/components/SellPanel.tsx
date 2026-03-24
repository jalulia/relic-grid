import React, { memo, useState } from 'react';
import { PortfolioItem } from '../game/types';
import { getRelicImage } from '../game/relicImages';

interface SellPanelProps {
  portfolio: PortfolioItem[];
  currency: number;
  onSell: (relicId: string) => void;
}

const SellPanel = memo(({ portfolio, currency, onSell }: SellPanelProps) => {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const netWorth = currency + portfolio.reduce((sum, p) => sum + p.marketPrice, 0);
  const totalPnl = portfolio.reduce((sum, p) => sum + (p.marketPrice - p.purchasePrice), 0);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-2 py-1.5 border-b border-cell-border shrink-0">
        <div className="flex justify-between items-baseline">
          <span className="text-[9px] text-muted-foreground font-mono" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            SELL — MARKET ORDERS
          </span>
          <span className="text-[9px] text-accent font-mono" style={{ fontWeight: 600 }}>
            ◈ {netWorth}
          </span>
        </div>
        <div className="flex justify-between items-baseline mt-0.5">
          <span className="text-[8px] text-muted-foreground font-mono">
            {portfolio.length} held · Cash ◈{currency}
          </span>
          <span className={`text-[8px] font-mono ${totalPnl >= 0 ? 'text-success' : 'text-destructive'}`} style={{ fontWeight: 600 }}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl} ({portfolio.length > 0 ? Math.round(totalPnl / portfolio.reduce((s, p) => s + p.purchasePrice, 1) * 100) : 0}%)
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {portfolio.length === 0 ? (
          <div className="p-3 text-[10px] text-muted-foreground font-mono text-center" style={{ letterSpacing: '0.04em' }}>
            No relics to sell.<br />Win auctions to acquire inventory.
          </div>
        ) : (
          portfolio.map(item => {
            const pnl = item.marketPrice - item.purchasePrice;
            const pnlPct = Math.round(pnl / item.purchasePrice * 100);
            const isLoss = pnl < 0;
            return (
              <div
                key={item.relic.id}
                className="flex items-center gap-2 px-2 py-1.5 border-b border-cell-border hover:bg-cell/50"
              >
                <img
                  src={getRelicImage(item.relic.id)}
                  alt={item.relic.name}
                  className="w-6 h-6 object-contain shrink-0"
                  style={{ opacity: 0.7 }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] text-foreground font-mono truncate" style={{ fontWeight: 600 }}>
                    {item.relic.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] text-muted-foreground font-mono">
                      {item.relic.saintName}
                    </span>
                    <span className="text-[8px] text-muted-foreground font-mono">
                      Cost ◈{item.purchasePrice}
                    </span>
                    <span className="text-[8px] font-mono">→</span>
                    <span className={`text-[8px] font-mono ${isLoss ? 'text-destructive' : 'text-success'}`} style={{ fontWeight: 600 }}>
                      ◈{item.marketPrice}
                    </span>
                    <span className={`text-[7px] font-mono ${isLoss ? 'text-destructive' : 'text-success'}`}>
                      {pnl >= 0 ? '+' : ''}{pnlPct}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirmId === item.relic.id) {
                      onSell(item.relic.id);
                      setConfirmId(null);
                    } else {
                      setConfirmId(item.relic.id);
                    }
                  }}
                  onBlur={() => setConfirmId(null)}
                  className={`text-[8px] font-mono px-2 border shrink-0 ${
                    confirmId === item.relic.id
                      ? 'text-foreground border-foreground bg-foreground/10'
                      : isLoss
                        ? 'text-destructive border-destructive/40 hover:bg-destructive/10'
                        : 'text-success border-success/40 hover:bg-success/10'
                  }`}
                  style={{ height: 20, letterSpacing: '0.04em', fontWeight: 600 }}
                >
                  {confirmId === item.relic.id ? 'CONFIRM?' : `SELL ◈${item.marketPrice}`}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

SellPanel.displayName = 'SellPanel';
export default SellPanel;

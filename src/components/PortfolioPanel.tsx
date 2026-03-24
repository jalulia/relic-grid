import React, { memo, useMemo } from 'react';
import { PortfolioItem, Saint } from '../game/types';

interface PortfolioPanelProps {
  portfolio: PortfolioItem[];
  saints: Saint[];
  currency: number;
}

const PortfolioPanel = memo(({ portfolio, saints, currency }: PortfolioPanelProps) => {
  const holdingsValue = portfolio.reduce((sum, p) => sum + p.marketPrice, 0);
  const netWorth = currency + holdingsValue;
  const totalCost = portfolio.reduce((sum, p) => sum + p.purchasePrice, 0);
  const totalPnl = holdingsValue - totalCost;

  const grouped = useMemo(() => {
    const map: Record<string, PortfolioItem[]> = {};
    portfolio.forEach(item => {
      const sid = item.relic.saintId;
      if (!map[sid]) map[sid] = [];
      map[sid].push(item);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [portfolio]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Net Worth Header */}
      <div className="px-2 py-2 border-b border-cell-border shrink-0">
        <div className="text-[9px] text-muted-foreground font-mono mb-1" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
          PORTFOLIO OVERVIEW
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[14px] text-accent font-mono" style={{ fontWeight: 600 }}>
            ◈ {netWorth}
          </span>
          <span className="text-[9px] text-muted-foreground font-mono">NET WORTH</span>
        </div>
        <div className="flex gap-3 mt-1">
          <div>
            <div className="text-[7px] text-muted-foreground font-mono" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>CASH</div>
            <div className="text-[10px] text-foreground font-mono" style={{ fontWeight: 500 }}>◈ {currency}</div>
          </div>
          <div>
            <div className="text-[7px] text-muted-foreground font-mono" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>HOLDINGS</div>
            <div className="text-[10px] text-foreground font-mono" style={{ fontWeight: 500 }}>◈ {holdingsValue}</div>
          </div>
          <div>
            <div className="text-[7px] text-muted-foreground font-mono" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>P&L</div>
            <div className={`text-[10px] font-mono ${totalPnl >= 0 ? 'text-success' : 'text-destructive'}`} style={{ fontWeight: 500 }}>
              {totalPnl >= 0 ? '+' : ''}◈ {totalPnl}
            </div>
          </div>
        </div>
      </div>

      {/* Saint Breakdown */}
      <div className="flex-1 overflow-y-auto">
        {portfolio.length === 0 ? (
          <div className="p-3 text-[10px] text-muted-foreground font-mono text-center">
            Portfolio empty. Win auctions to begin.
          </div>
        ) : (
          grouped.map(([saintId, items]) => {
            const saint = saints.find(s => s.id === saintId);
            if (!saint) return null;
            const groupValue = items.reduce((s, p) => s + p.marketPrice, 0);
            const groupCost = items.reduce((s, p) => s + p.purchasePrice, 0);
            const groupPnl = groupValue - groupCost;
            return (
              <div key={saintId} className="border-b border-cell-border">
                <div className="flex justify-between items-center px-2 py-1 bg-cell/30">
                  <span className="text-[9px] text-foreground font-mono" style={{ fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {saint.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-muted-foreground font-mono">
                      {items.length} held + {saint.collectedRelics.length} enshrined / {saint.totalRelics}
                    </span>
                    <span className={`text-[8px] font-mono ${groupPnl >= 0 ? 'text-success' : 'text-destructive'}`} style={{ fontWeight: 600 }}>
                      {groupPnl >= 0 ? '+' : ''}◈{groupPnl}
                    </span>
                  </div>
                </div>
                {items.map(item => (
                  <div key={item.relic.id} className="flex justify-between items-center px-2 py-0.5">
                    <span className="text-[8px] text-muted-foreground font-mono truncate" style={{ maxWidth: '60%' }}>
                      {item.relic.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] text-muted-foreground font-mono">◈{item.purchasePrice}</span>
                      <span className="text-[8px] text-muted-foreground font-mono">→</span>
                      <span className={`text-[8px] font-mono ${item.marketPrice >= item.purchasePrice ? 'text-success' : 'text-destructive'}`} style={{ fontWeight: 500 }}>
                        ◈{item.marketPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

PortfolioPanel.displayName = 'PortfolioPanel';
export default PortfolioPanel;

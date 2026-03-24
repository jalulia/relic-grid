import React, { memo } from 'react';
import { MarketState } from '../game/pricing';
import { Saint } from '../game/types';

interface IntelPanelProps {
  market: MarketState;
  saints: Saint[];
  lotCount: number;
}

const SECT_DATA = [
  { name: 'FLAGELLANT', saints: 'SEB / FRA', color: 'hsl(0 70% 50%)' },
  { name: 'CATHARI', saints: 'CAT / TER', color: 'hsl(195 55% 50%)' },
  { name: 'BOGOMILS', saints: 'LUC / AGA', color: 'hsl(130 40% 38%)' },
  { name: 'GNOSTIC', saints: 'AMB / BAR', color: 'hsl(270 40% 55%)' },
  { name: 'WALDENSIAN', saints: 'ALL', color: 'hsl(35 70% 48%)' },
];

const IntelPanel = memo(({ market, saints, lotCount }: IntelPanelProps) => {
  const eventCount = market.activeEvents.length;
  const tempPct = Math.round((market.globalTemp - 0.6) / 0.9 * 100);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-2 py-1.5 border-b border-cell-border shrink-0">
        <span className="text-[9px] text-muted-foreground font-mono" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
          INTEL — MARKET CONDITIONS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Global Market Temp */}
        <div className="px-2 py-1.5 border-b border-cell-border">
          <div className="text-[8px] text-muted-foreground font-mono mb-1" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            MARKET TEMPERATURE
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-[14px] font-mono ${market.globalTemp > 1.1 ? 'text-success' : market.globalTemp < 0.9 ? 'text-destructive' : 'text-accent'}`} style={{ fontWeight: 600 }}>
              {market.globalTemp.toFixed(2)}x
            </span>
            <span className="text-[8px] text-muted-foreground font-mono">
              {market.globalTemp > 1.15 ? 'BULL MARKET' :
               market.globalTemp > 1.05 ? 'WARM' :
               market.globalTemp > 0.95 ? 'STABLE' :
               market.globalTemp > 0.85 ? 'COOLING' :
               'BEAR MARKET'}
            </span>
          </div>
          <div className="h-[3px] bg-cell-border mt-1" style={{ width: '100%' }}>
            <div
              style={{
                width: `${tempPct}%`,
                height: '100%',
                background: market.globalTemp > 1.1 ? 'hsl(130 60% 36%)' :
                  market.globalTemp < 0.9 ? 'hsl(0 70% 50%)' : 'hsl(45 80% 46%)',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>

        {/* Saint Demand */}
        <div className="px-2 py-1.5 border-b border-cell-border">
          <div className="text-[8px] text-muted-foreground font-mono mb-1" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            SAINT DEMAND
          </div>
          {saints.map(saint => {
            const demand = market.saintDemand[saint.id] ?? 1.0;
            const delta = demand - 1.0;
            const barWidth = Math.min(100, Math.max(5, demand / 2.0 * 100));
            return (
              <div key={saint.id} className="flex items-center gap-1 py-0.5">
                <span className="text-[8px] text-muted-foreground font-mono" style={{ width: 70, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {saint.name.slice(0, 8)}
                </span>
                <div className="flex-1 h-[3px] bg-cell-border">
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      background: delta > 0.15 ? 'hsl(130 60% 36%)' :
                        delta < -0.15 ? 'hsl(0 70% 50%)' : 'hsl(45 80% 46%)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <span className={`text-[8px] font-mono ${delta > 0.05 ? 'text-success' : delta < -0.05 ? 'text-destructive' : 'text-muted-foreground'}`} style={{ width: 38, textAlign: 'right', fontWeight: 500 }}>
                  {delta >= 0 ? '+' : ''}{(delta * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Sect Activity */}
        <div className="px-2 py-1.5 border-b border-cell-border">
          <div className="text-[8px] text-muted-foreground font-mono mb-1" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            SECT ACTIVITY
          </div>
          {SECT_DATA.map(sect => (
            <div key={sect.name} className="flex items-center gap-1 py-0.5">
              <span style={{ width: 5, height: 5, background: sect.color, display: 'inline-block', flexShrink: 0 }} />
              <span className="text-[7px] text-muted-foreground font-mono" style={{ width: 65, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                {sect.name}
              </span>
              <span className="text-[7px] text-muted-foreground font-mono" style={{ flexShrink: 0 }}>
                {sect.saints}
              </span>
            </div>
          ))}
        </div>

        {/* Market Stats */}
        <div className="px-2 py-1.5 border-b border-cell-border">
          <div className="text-[8px] text-muted-foreground font-mono mb-1" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            MARKET STATS
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-[8px] text-muted-foreground font-mono">ACTIVE LOTS</span>
            <span className="text-[8px] text-foreground font-mono" style={{ fontWeight: 500 }}>{lotCount}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-[8px] text-muted-foreground font-mono">ACTIVE EVENTS</span>
            <span className={`text-[8px] font-mono ${eventCount > 3 ? 'text-destructive' : eventCount > 0 ? 'text-accent' : 'text-muted-foreground'}`} style={{ fontWeight: 500 }}>
              {eventCount}
            </span>
          </div>
        </div>

        {/* Active Events */}
        {market.activeEvents.length > 0 && (
          <div className="px-2 py-1.5">
            <div className="text-[8px] text-muted-foreground font-mono mb-1" style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              ACTIVE EVENTS
            </div>
            {market.activeEvents.slice(-5).map(evt => {
              const remaining = Math.max(0, Math.round((evt.duration - (Date.now() - evt.startedAt)) / 1000));
              return (
                <div key={evt.id} className="py-0.5">
                  <div className="text-[8px] text-foreground font-mono truncate" style={{ fontWeight: 500 }}>
                    {evt.title}
                  </div>
                  <div className="text-[7px] text-muted-foreground font-mono">
                    {evt.effect} · {remaining}s remaining
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

IntelPanel.displayName = 'IntelPanel';
export default IntelPanel;

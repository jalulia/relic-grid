import { memo } from 'react';
import { Saint } from '../game/types';

interface SaintTrackerProps {
  saints: Saint[];
  currency: number;
  netWorth?: number;
}

const SaintTracker = memo(({ saints, currency, netWorth }: SaintTrackerProps) => {
  const activeSaints = saints.filter(s => s.collectedRelics.length > 0 || true);
  const isLow = currency < 200 && currency > 0;

  return (
    <div className="flex items-center gap-3 px-3 overflow-x-auto" style={{ height: 28, fontSize: 10 }}>
      <span className={`font-mono whitespace-nowrap ${isLow ? 'text-destructive animate-pulse' : 'text-accent'}`}>
        ◈ {currency}
      </span>
      {netWorth !== undefined && netWorth !== currency && (
        <span className="text-muted-foreground font-mono whitespace-nowrap" style={{ fontSize: 8 }}>
          NW ◈{netWorth}
        </span>
      )}
      <span className="text-muted-foreground">│</span>
      {activeSaints.map(saint => {
        const filled = saint.collectedRelics.length;
        const total = saint.totalRelics;
        const bar = '█'.repeat(filled) + '░'.repeat(total - filled);
        return (
          <span key={saint.id} className="text-muted-foreground whitespace-nowrap font-mono">
            {saint.name}{' '}
            <span className={filled === total ? 'text-accent' : 'text-primary'}>{bar}</span>{' '}
            {filled}/{total}
          </span>
        );
      })}
    </div>
  );
});

SaintTracker.displayName = 'SaintTracker';

export default SaintTracker;

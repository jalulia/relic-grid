import { memo } from 'react';
import { Saint } from '../game/types';

interface SaintTrackerProps {
  saints: Saint[];
  currency: number;
}

const SaintTracker = memo(({ saints, currency }: SaintTrackerProps) => {
  const activeSaints = saints.filter(s => s.collectedRelics.length > 0 || true);

  return (
    <div className="flex items-center gap-3 px-3 overflow-x-auto" style={{ height: 28, fontSize: 10 }}>
      <span className="text-accent font-mono whitespace-nowrap">◈ {currency}</span>
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

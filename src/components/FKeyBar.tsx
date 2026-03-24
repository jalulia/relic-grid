import React, { memo } from 'react';

export type FKeyView = 'buy' | 'sell' | 'port' | 'enshrine' | 'intel' | 'doctrine' | 'log' | 'sys' | 'media';

const FKEYS: { key: string; label: string; view: FKeyView }[] = [
  { key: 'B', label: 'BUY', view: 'buy' },
  { key: 'S', label: 'SELL', view: 'sell' },
  { key: 'P', label: 'PORT', view: 'port' },
  { key: 'N', label: 'ENSHRINE', view: 'enshrine' },
  { key: 'I', label: 'INTEL', view: 'intel' },
  { key: 'D', label: 'DOCTRINE', view: 'doctrine' },
  { key: 'L', label: 'LOG', view: 'log' },
  { key: 'Y', label: 'SYS', view: 'sys' },
  { key: 'M', label: 'MEDIA', view: 'media' },
];

interface FKeyBarProps {
  activeView: FKeyView;
  onViewChange: (view: FKeyView) => void;
  notifications?: Partial<Record<FKeyView, boolean>>;
}

const FKeyBar = memo(({ activeView, onViewChange, notifications = {} }: FKeyBarProps) => {
  return (
    <div
      className="flex items-stretch border-t border-cell-border bg-cell shrink-0"
      style={{ height: 30 }}
    >
      {FKEYS.map(({ key, label, view }) => {
        const isActive = activeView === view;
        const hasNotification = notifications[view];
        return (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className="flex-1 flex items-center justify-center gap-1 font-mono border-r border-cell-border last:border-r-0"
            style={{
              fontSize: 10,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              color: isActive ? 'hsl(225 100% 58%)' : 'hsl(240 5% 45%)',
              borderTop: isActive ? '2px solid hsl(225 100% 58%)' : '2px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              position: 'relative',
              padding: '0 2px',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 9 }}>{key}</span>
            <span style={{ fontWeight: 400 }}>{label}</span>
            {hasNotification && !isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 4,
                  height: 4,
                  background: 'hsl(45 80% 46%)',
                  borderRadius: 0,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
});

FKeyBar.displayName = 'FKeyBar';
export default FKeyBar;
export { FKEYS };

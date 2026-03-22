import { memo } from 'react';
import { SECTS } from '../game/heresy';

interface HeresyMeterProps {
  threat: number; // 0-100
  currency: number;
  onReport: () => void;
  isSlowed: boolean;
}

const HeresyMeter = memo(({ threat, currency, onReport, isSlowed }: HeresyMeterProps) => {
  const canAfford = currency >= 50;
  const threatLevel =
    threat >= 80 ? { label: 'CRITICAL', cls: 'text-destructive' } :
    threat >= 50 ? { label: 'ELEVATED', cls: 'text-accent' } :
    threat >= 25 ? { label: 'MODERATE', cls: 'text-sect-orange' } :
    { label: 'LOW', cls: 'text-muted-foreground' };

  // Pick a sect color for the fill based on threat level
  const fillColor =
    threat >= 80 ? 'hsl(0 75% 55%)' :
    threat >= 50 ? 'hsl(45 100% 50%)' :
    threat >= 25 ? 'hsl(30 90% 55%)' :
    'hsl(225 100% 58%)';

  const glowIntensity = Math.min(threat / 100, 1);

  return (
    <div className="flex flex-col border-b border-cell-border bg-cell shrink-0 px-2 py-1.5" style={{ height: 88 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-muted-foreground font-mono">TRIBUNAL THREAT</span>
        <span className={`text-[9px] font-mono font-bold ${threatLevel.cls}`}>
          {threatLevel.label}
        </span>
      </div>

      {/* Threat bar */}
      <div className="relative w-full bg-secondary overflow-hidden" style={{ height: 14 }}>
        <div
          className="absolute inset-y-0 left-0 transition-all duration-500"
          style={{
            width: `${Math.min(threat, 100)}%`,
            backgroundColor: fillColor,
            boxShadow: glowIntensity > 0.5 ? `0 0 ${glowIntensity * 12}px ${fillColor}` : 'none',
          }}
        />
        {/* Tick marks */}
        {[25, 50, 75].map(mark => (
          <div
            key={mark}
            className="absolute top-0 bottom-0 border-l border-muted-foreground/30"
            style={{ left: `${mark}%` }}
          />
        ))}
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] font-mono text-foreground font-bold" style={{ textShadow: '0 0 4px hsl(240 12% 4%)' }}>
            {Math.round(threat)}%
          </span>
        </div>
      </div>

      {/* Sect activity dots */}
      <div className="flex items-center gap-1 mt-1">
        {SECTS.map(sect => (
          <div
            key={sect.id}
            className={`rounded-full ${sect.dotClass}`}
            style={{
              width: 5, height: 5,
              opacity: 0.3 + (threat / 100) * 0.7,
              boxShadow: threat > 60 ? `0 0 3px currentColor` : 'none',
            }}
          />
        ))}
        <span className="text-[7px] text-muted-foreground font-mono ml-auto">SECT ACTIVITY</span>
      </div>

      {/* Report button */}
      <button
        onClick={onReport}
        disabled={!canAfford || isSlowed}
        className={`mt-1 w-full font-mono border transition-colors ${
          canAfford && !isSlowed
            ? 'bg-cell-titlebar border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground cursor-pointer'
            : 'bg-cell-titlebar border-cell-border text-muted-foreground cursor-not-allowed opacity-50'
        }`}
        style={{ height: 18, fontSize: 9, letterSpacing: 1 }}
      >
        {isSlowed ? '▓ ACTIVE ▓' : `REPORT HERESY — ◈50`}
      </button>
    </div>
  );
});

HeresyMeter.displayName = 'HeresyMeter';

export default HeresyMeter;

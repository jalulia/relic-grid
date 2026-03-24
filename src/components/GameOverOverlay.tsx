import React, { memo } from 'react';
import { GameOverStats } from '../game/types';

interface GameOverOverlayProps {
  stats: GameOverStats;
  onRestart: () => void;
}

const FONT_MONO = "'IBM Plex Mono', monospace";

const GameOverOverlay = memo(({ stats, onRestart }: GameOverOverlayProps) => {
  const isVictory = stats.reason === 'victory';
  const minutes = Math.floor(stats.timePlayed / 60000);
  const seconds = Math.floor((stats.timePlayed % 60000) / 1000);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'hsl(240 12% 4%)',
        border: `1px solid ${isVictory ? 'hsl(225 80% 55%)' : 'hsl(0 60% 45%)'}`,
        padding: '24px 32px',
        maxWidth: 360,
        width: '100%',
      }}>
        {/* Title */}
        <div style={{
          fontFamily: FONT_MONO,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: isVictory ? 'hsl(225 80% 55%)' : 'hsl(0 60% 55%)',
          textAlign: 'center',
          marginBottom: 4,
        }}>
          {isVictory ? 'SESSION COMPLETE' : 'SESSION TERMINATED'}
        </div>

        <div style={{
          fontFamily: FONT_MONO,
          fontSize: 18,
          fontWeight: 800,
          color: 'hsl(0 0% 90%)',
          textAlign: 'center',
          marginBottom: 16,
          letterSpacing: '-0.01em',
        }}>
          {isVictory ? 'VICTORY' : 'BANKRUPTCY'}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid hsl(225 15% 18%)', margin: '0 0 12px' }} />

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <StatRow label="NET WORTH" value={`◈ ${stats.netWorth.toLocaleString()}`} />
          <StatRow label="SAINTS COMPLETE" value={`${stats.saintsCompleted} / 8`} />
          <StatRow label="RELICS ENSHRINED" value={String(stats.relicsCollected)} />
          <StatRow label="SESSION TIME" value={`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`} />
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid hsl(225 15% 18%)', margin: '12px 0' }} />

        {/* Restart */}
        <button
          onClick={onRestart}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: isVictory ? 'hsl(225 80% 55%)' : 'hsl(0 0% 90%)',
            background: isVictory ? 'hsla(225, 80%, 55%, 0.1)' : 'hsla(0, 0%, 90%, 0.05)',
            border: `1px solid ${isVictory ? 'hsl(225 80% 55%)' : 'hsl(0 0% 50%)'}`,
            padding: '8px 16px',
            cursor: 'pointer',
            width: '100%',
            display: 'block',
          }}
        >
          NEW SESSION →
        </button>
      </div>
    </div>
  );
});

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9 }}>
      <span style={{ color: 'hsl(240 5% 50%)', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ color: 'hsl(0 0% 90%)', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

GameOverOverlay.displayName = 'GameOverOverlay';
export default GameOverOverlay;

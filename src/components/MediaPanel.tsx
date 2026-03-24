import React, { memo, useState } from 'react';
import { MarketState } from '../game/pricing';
import { Saint, Headline } from '../game/types';

const FONT_MONO = "'IBM Plex Mono', monospace";
const FONT_SANS = "'DM Sans', system-ui, sans-serif";

const C = {
  bg: '#EAEAEE',
  surface: '#E0E0E4',
  rule: '#C8C8CE',
  textDim: '#9898A0',
  textMeta: '#686870',
  textPrimary: '#18181C',
  accent: '#2A4BD7',
  amber: '#D4A017',
  green: '#2A6B30',
  red: '#A02020',
} as const;

interface MediaPanelProps {
  market: MarketState;
  saints: Saint[];
  activeHeadlines: Headline[];
  currency: number;
  costs: { commission: (saintId: string) => number; suppress: number; fabricate: number };
  onCommission: (saintId: string) => void;
  onSuppress: (headlineId: number) => void;
  onFabricate: (saintId: string) => void;
}

type ActionMode = null | 'commission' | 'fabricate';

const MediaPanel = memo(({
  market, saints, activeHeadlines, currency, costs,
  onCommission, onSuppress, onFabricate,
}: MediaPanelProps) => {
  const [actionMode, setActionMode] = useState<ActionMode>(null);

  const heresyHeadlines = activeHeadlines.filter(h => h.type === 'heresy');
  const activeCommissions = activeHeadlines.filter(h => h.type === 'commission');
  const activeFabrications = activeHeadlines.filter(h => h.type === 'fabrication');

  const handleSaintSelect = (saintId: string) => {
    if (actionMode === 'commission') {
      onCommission(saintId);
    } else if (actionMode === 'fabricate') {
      onFabricate(saintId);
    }
    setActionMode(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, color: C.textPrimary }}>
      {/* Masthead */}
      <div style={{ padding: '6px 10px 4px', borderBottom: `2px solid ${C.textPrimary}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textDim }}>
            PCSAI PRESS MONITORING DIVISION
          </span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textDim }}>
            INTERACTIVE EDITION
          </span>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: C.textPrimary, textAlign: 'center', lineHeight: 1.1 }}>
          THE HOLY OBSERVER
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMeta, textAlign: 'center', paddingBottom: 2 }}>
          RELIC MARKET INTELLIGENCE &middot; NARRATIVE OPERATIONS
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 10px' }}>

        {/* ── ACTION BAR ── */}
        <div style={{ fontFamily: FONT_MONO, fontSize: 7, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.textMeta, marginBottom: 4 }}>
          NARRATIVE OPERATIONS
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          <ActionButton
            label="COMMISSION"
            cost={`◈${costs.commission(saints[0]?.id ?? '')}`}
            color={C.green}
            active={actionMode === 'commission'}
            onClick={() => setActionMode(actionMode === 'commission' ? null : 'commission')}
          />
          <ActionButton
            label="SUPPRESS"
            cost={`◈${costs.suppress}`}
            color={C.amber}
            disabled={heresyHeadlines.length === 0}
            onClick={() => {
              if (heresyHeadlines.length > 0) onSuppress(heresyHeadlines[0].id);
            }}
          />
          <ActionButton
            label="FABRICATE"
            cost={`◈${costs.fabricate}`}
            color={C.red}
            active={actionMode === 'fabricate'}
            onClick={() => setActionMode(actionMode === 'fabricate' ? null : 'fabricate')}
          />
        </div>

        {/* Saint selector (when commission or fabricate active) */}
        {actionMode && (
          <div style={{ background: C.surface, padding: '6px 8px', marginBottom: 8, border: `1px solid ${C.rule}` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 7, fontWeight: 700, letterSpacing: '0.10em', color: C.textMeta, marginBottom: 4 }}>
              SELECT SAINT — {actionMode === 'commission' ? 'POSITIVE STORY' : 'MIRACLE FABRICATION'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
              {saints.map(s => {
                const cost = actionMode === 'commission' ? costs.commission(s.id) : costs.fabricate;
                const canAfford = currency >= cost;
                return (
                  <button
                    key={s.id}
                    onClick={() => canAfford && handleSaintSelect(s.id)}
                    style={{
                      fontFamily: FONT_MONO,
                      fontSize: 8,
                      color: canAfford ? C.textPrimary : C.textDim,
                      background: 'none',
                      border: `1px solid ${canAfford ? C.rule : 'transparent'}`,
                      padding: '3px 6px',
                      cursor: canAfford ? 'pointer' : 'default',
                      textAlign: 'left',
                      opacity: canAfford ? 1 : 0.5,
                    }}
                  >
                    {s.name} <span style={{ color: C.textDim, fontSize: 7 }}>◈{cost}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ACTIVE HEADLINES ── */}
        {activeHeadlines.length > 0 && (
          <>
            <div style={{ fontFamily: FONT_MONO, fontSize: 7, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.textMeta, marginBottom: 4, marginTop: 4 }}>
              ACTIVE HEADLINES
            </div>
            {activeHeadlines.map(h => (
              <HeadlineRow key={h.id} headline={h} onSuppress={onSuppress} currency={currency} suppressCost={costs.suppress} />
            ))}
          </>
        )}

        <div style={{ borderTop: `1px solid ${C.rule}`, margin: '8px 0' }} />

        {/* ── MARKET SENTIMENT ── */}
        <div style={{ fontFamily: FONT_MONO, fontSize: 7, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.textMeta, marginBottom: 4 }}>
          MARKET SENTIMENT
        </div>
        <div style={{ background: C.surface, padding: '6px 8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 50px', gap: 0, borderBottom: `1px solid ${C.textPrimary}`, paddingBottom: 2, marginBottom: 2 }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 7, fontWeight: 600, letterSpacing: '0.08em', color: C.textMeta }}>SAINT</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 7, fontWeight: 600, letterSpacing: '0.08em', color: C.textMeta, textAlign: 'right' }}>DEMAND</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 7, fontWeight: 600, letterSpacing: '0.08em', color: C.textMeta, textAlign: 'right' }}>SENT.</span>
          </div>
          {saints.map(s => {
            const demand = market.saintDemand[s.id] ?? 1.0;
            const sentiment = market.sentiment[s.id] ?? 0;
            const demandColor = demand > 1.05 ? C.green : demand < 0.95 ? C.red : C.textMeta;
            const sentColor = sentiment > 0.1 ? C.green : sentiment < -0.1 ? C.red : C.textMeta;
            return (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 50px 50px', gap: 0, padding: '1px 0', borderBottom: `1px solid ${C.rule}` }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.textPrimary }}>{s.name}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 8, color: demandColor, textAlign: 'right' }}>{demand.toFixed(2)}x</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 8, color: sentColor, textAlign: 'right' }}>
                  {sentiment >= 0 ? '+' : ''}{(sentiment * 100).toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '3px 10px', borderTop: `2px solid ${C.textPrimary}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 7, fontWeight: 700, letterSpacing: '0.14em', color: C.accent }}>RESTRICTED</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 7, letterSpacing: '0.08em', color: C.textDim }}>NARRATIVE OPERATIONS DIVISION</span>
        </div>
      </div>
    </div>
  );
});

function ActionButton({ label, cost, color, active, disabled, onClick }: {
  label: string; cost: string; color: string; active?: boolean; disabled?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 7,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: disabled ? '#9898A0' : active ? '#EAEAEE' : color,
        background: disabled ? 'none' : active ? color : 'none',
        border: `1px solid ${disabled ? '#C8C8CE' : color}`,
        padding: '4px 8px',
        cursor: disabled ? 'default' : 'pointer',
        flex: 1,
        textAlign: 'center',
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {label}<br />
      <span style={{ fontSize: 6, fontWeight: 400, opacity: 0.7 }}>{cost}</span>
    </button>
  );
}

function HeadlineRow({ headline, onSuppress, currency, suppressCost }: {
  headline: Headline; onSuppress: (id: number) => void; currency: number; suppressCost: number;
}) {
  const typeColors: Record<Headline['type'], string> = {
    commission: '#2A6B30',
    suppress: '#D4A017',
    fabrication: '#A02020',
    heresy: '#A02020',
  };
  const typeLabels: Record<Headline['type'], string> = {
    commission: 'COMMISSION',
    suppress: 'SUPPRESSED',
    fabrication: 'FABRICATION',
    heresy: 'HERESY',
  };

  return (
    <div style={{
      background: '#E0E0E4',
      padding: '4px 6px',
      marginBottom: 3,
      borderLeft: `2px solid ${typeColors[headline.type]}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 6,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: typeColors[headline.type],
            border: `1px solid ${typeColors[headline.type]}`,
            padding: '0 3px',
          }}>
            {typeLabels[headline.type]}
          </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontWeight: 600, color: '#18181C' }}>
            {headline.title}
          </span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 7, color: '#686870', whiteSpace: 'nowrap' }}>
          {headline.ticksRemaining}t
          {headline.type === 'fabrication' && (
            <span style={{ color: '#A02020', marginLeft: 4 }}>
              {Math.round(headline.collapseChance * 100)}% risk
            </span>
          )}
        </span>
      </div>
      {headline.type === 'heresy' && (
        <button
          onClick={() => currency >= suppressCost && onSuppress(headline.id)}
          disabled={currency < suppressCost}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 6,
            fontWeight: 700,
            color: currency >= suppressCost ? '#D4A017' : '#9898A0',
            background: 'none',
            border: `1px solid ${currency >= suppressCost ? '#D4A017' : '#C8C8CE'}`,
            padding: '1px 6px',
            marginTop: 3,
            cursor: currency >= suppressCost ? 'pointer' : 'default',
            opacity: currency >= suppressCost ? 1 : 0.5,
          }}
        >
          SUPPRESS ◈{suppressCost}
        </button>
      )}
    </div>
  );
}

MediaPanel.displayName = 'MediaPanel';
export default MediaPanel;

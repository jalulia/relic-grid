import React, { memo, useState } from 'react';

type Section = 'rules' | 'classes' | 'saints' | 'sects' | 'keys';

const FONT_MONO = "'IBM Plex Mono', monospace";
const C = {
  bg: 'hsl(240 12% 4%)',
  surface: 'hsl(240 10% 8%)',
  border: 'hsl(225 15% 18%)',
  textDim: 'hsl(240 5% 40%)',
  textMeta: 'hsl(240 5% 55%)',
  textPrimary: 'hsl(0 0% 90%)',
  accent: 'hsl(225 80% 55%)',
  amber: 'hsl(40 90% 50%)',
};

const SectionButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: FONT_MONO,
      fontSize: 7,
      fontWeight: 700,
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      color: active ? C.accent : C.textDim,
      background: active ? 'hsla(225, 80%, 55%, 0.1)' : 'none',
      border: `1px solid ${active ? C.accent : 'transparent'}`,
      padding: '2px 6px',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT_MONO, fontSize: 7, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: C.textDim, marginBottom: 4, marginTop: 10 }}>
    {children}
  </div>
);

const Row: React.FC<{ left: string; right: string; color?: string }> = ({ left, right, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0', fontFamily: FONT_MONO, fontSize: 8 }}>
    <span style={{ color: color ?? C.textMeta }}>{left}</span>
    <span style={{ color: C.textPrimary }}>{right}</span>
  </div>
);

function RulesSection() {
  return (
    <>
      <Label>Objective</Label>
      <p style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.textMeta, lineHeight: 1.6, margin: 0 }}>
        Complete saint collections by winning relic auctions. Each saint requires all their relics to be enshrined. Budget is fixed — no refills.
      </p>
      <Label>Auction Flow</Label>
      <p style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.textMeta, lineHeight: 1.6, margin: 0 }}>
        Lots appear on the grid with countdown timers. Click a lot to open the bid panel. Place a bid above the current price. When the timer expires, the highest bidder wins. You are only charged when you win.
      </p>
      <Label>Portfolio</Label>
      <p style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.textMeta, lineHeight: 1.6, margin: 0 }}>
        Won relics enter your portfolio. From there you can ENSHRINE (lock into a saint's collection) or SELL (liquidate at market price). Enshrined relics cannot be sold.
      </p>
      <Label>Market Dynamics</Label>
      <p style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.textMeta, lineHeight: 1.6, margin: 0 }}>
        Relic prices fluctuate based on saint demand, market events, and heresy activity. Completing 80%+ of a saint triggers a completion premium on remaining relics.
      </p>
    </>
  );
}

function ClassesSection() {
  return (
    <>
      <Label>Relic Classification</Label>
      <Row left="CLASS I — CORPOREAL" right="1.2x" />
      <p style={{ fontFamily: FONT_MONO, fontSize: 7, color: C.textDim, lineHeight: 1.5, margin: '1px 0 6px 0' }}>
        Body parts: bones, organs, blood, preserved tissue
      </p>
      <Row left="CLASS II — POSSESSIONAL" right="1.0x" />
      <p style={{ fontFamily: FONT_MONO, fontSize: 7, color: C.textDim, lineHeight: 1.5, margin: '1px 0 6px 0' }}>
        Personal effects: tunics, veils, cloths, garments
      </p>
      <Row left="CLASS III — CONTACTUAL" right="0.85x" />
      <p style={{ fontFamily: FONT_MONO, fontSize: 7, color: C.textDim, lineHeight: 1.5, margin: '1px 0 6px 0' }}>
        Objects of contact: vials, dust, oil, touched items
      </p>
      <Label>Completion Premium</Label>
      <p style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.textMeta, lineHeight: 1.6, margin: 0 }}>
        When you hold 80%+ of a saint's relics, market value receives up to 2x multiplier. At 100% completion, portfolio value doubles for that saint.
      </p>
    </>
  );
}

function SaintsSection() {
  const saints = [
    { name: 'AMBROSE', count: 12, origin: 'Milan' },
    { name: 'LUCIA', count: 10, origin: 'Venice' },
    { name: 'SEBASTIAN', count: 12, origin: 'Rome' },
    { name: 'TERESA', count: 8, origin: 'Ávila' },
    { name: 'BARTHOLOMEW', count: 11, origin: 'Armenia' },
    { name: 'AGATHA', count: 9, origin: 'Catania' },
    { name: 'FRANCIS', count: 13, origin: 'Assisi' },
    { name: 'CATHERINE', count: 10, origin: 'Siena' },
  ];
  return (
    <>
      <Label>Saint Roster — 8 Saints, 85 Relics</Label>
      {saints.map(s => (
        <Row key={s.name} left={s.name} right={`${s.count} relics — ${s.origin}`} />
      ))}
    </>
  );
}

function SectsSection() {
  const sects = [
    { name: 'FLAGELLANTS', color: 'hsl(0 70% 55%)', desc: 'Panic buying — penitential saints surge' },
    { name: 'CATHARI', color: 'hsl(180 70% 55%)', desc: 'Demand freeze — material relics decline' },
    { name: 'GNOSTIC ORDER', color: 'hsl(300 70% 55%)', desc: 'Boost — intellectual saints appreciate' },
    { name: 'BOGOMILS', color: 'hsl(100 70% 55%)', desc: 'Class III crash — contact relics tank' },
    { name: 'WALDENSIANS', color: 'hsl(30 90% 55%)', desc: 'Class shift — Class II up, Class I down' },
  ];
  return (
    <>
      <Label>Heretical Sects</Label>
      {sects.map(s => (
        <div key={s.name} style={{ padding: '2px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, background: s.color, flexShrink: 0 }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.textPrimary, fontWeight: 600 }}>{s.name}</span>
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 7, color: C.textDim, marginLeft: 10 }}>{s.desc}</span>
        </div>
      ))}
      <Label>Heresy Mechanics</Label>
      <p style={{ fontFamily: FONT_MONO, fontSize: 8, color: C.textMeta, lineHeight: 1.6, margin: 0 }}>
        Heresy events fire periodically. During a heresy: market freezes, AI bidders pause, timers slow. This is your window to bid unopposed. Watch the terminal feed for early warnings.
      </p>
    </>
  );
}

function KeysSection() {
  const keys = [
    ['B', 'Buy — Bid Panel'],
    ['S', 'Sell — Market Orders'],
    ['P', 'Portfolio Overview'],
    ['N', 'Enshrine — Lock Relics'],
    ['I', 'Intel — Market Conditions'],
    ['D', 'Doctrine (this panel)'],
    ['L', 'Terminal Feed'],
    ['Y', 'System Status'],
    ['M', 'Media — The Holy Observer'],
    ['?', 'Reopen Tutorial'],
    ['ESC', 'Close Active Panel'],
    ['CLICK', 'Select lot → open bid'],
  ];
  return (
    <>
      <Label>Keyboard Shortcuts</Label>
      {keys.map(([key, desc]) => (
        <div key={key} style={{ display: 'flex', gap: 8, padding: '1px 0', fontFamily: FONT_MONO, fontSize: 8 }}>
          <span style={{ color: C.amber, fontWeight: 700, minWidth: 32 }}>{key}</span>
          <span style={{ color: C.textMeta }}>{desc}</span>
        </div>
      ))}
    </>
  );
}

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'rules', label: 'Rules' },
  { id: 'classes', label: 'Classes' },
  { id: 'saints', label: 'Saints' },
  { id: 'sects', label: 'Sects' },
  { id: 'keys', label: 'Keys' },
];

const DoctrinePanel = memo(() => {
  const [section, setSection] = useState<Section>('rules');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.bg, color: C.textPrimary }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 2, padding: '4px 6px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {SECTIONS.map(s => (
          <SectionButton key={s.id} label={s.label} active={section === s.id} onClick={() => setSection(s.id)} />
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 8px' }}>
        {section === 'rules' && <RulesSection />}
        {section === 'classes' && <ClassesSection />}
        {section === 'saints' && <SaintsSection />}
        {section === 'sects' && <SectsSection />}
        {section === 'keys' && <KeysSection />}
      </div>

      {/* Footer */}
      <div style={{ padding: '3px 8px', borderTop: `1px solid ${C.border}`, fontFamily: FONT_MONO, fontSize: 7, color: C.textDim, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        PCSAI DOCTRINE DIVISION — OPERATIONAL MANUAL v0.2
      </div>
    </div>
  );
});

DoctrinePanel.displayName = 'DoctrinePanel';
export default DoctrinePanel;

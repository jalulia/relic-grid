import { useCallback } from 'react';

interface TutorialOverlayProps {
  onDismiss: () => void;
}

export default function TutorialOverlay({ onDismiss }: TutorialOverlayProps) {
  const handleDismiss = useCallback(() => onDismiss(), [onDismiss]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/95" style={{ zIndex: 9000 }}>
      <div
        className="border border-cell-border bg-cell flex flex-col"
        style={{ width: 920, maxWidth: '95vw', maxHeight: '92vh' }}
      >
        {/* ── TITLE BAR ── */}
        <div
          className="flex items-center justify-between bg-cell-titlebar px-3 border-b border-cell-border shrink-0"
          style={{ height: 22 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-mono" style={{ fontSize: 9, letterSpacing: 1.5 }}>
              BRIEFING.EXE
            </span>
            <span className="text-muted-foreground/40 font-mono" style={{ fontSize: 9 }}>│</span>
            <span className="text-muted-foreground/60 font-mono" style={{ fontSize: 8, letterSpacing: 1 }}>
              PCSAI SERIES 9 OPERATOR FIELD MANUAL
            </span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground font-mono"
            style={{ fontSize: 10 }}
          >
            [×]
          </button>
        </div>

        {/* ── CONTENT: 3-COLUMN REFERENCE CARD ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', minHeight: 0 }}>

            {/* ═══ COLUMN 1: THE GRID ═══ */}
            <div className="border-r border-cell-border flex flex-col">
              <SectionHeader label="01" title="THE GRID" />

              <div className="p-3 flex flex-col gap-3 flex-1">
                <p className="text-foreground font-mono" style={{ fontSize: 10, lineHeight: '16px' }}>
                  Each rectangle is a <span className="text-primary font-bold">lot</span> — a relic for sale.
                  Cells resize dynamically: hot lots grow, quiet ones shrink.
                </p>

                {/* Annotated mock cell */}
                <div className="relative" style={{ paddingRight: 80 }}>
                  <div className="border border-cell-border bg-cell">
                    <div
                      className="bg-cell-titlebar px-1.5 flex items-center justify-between"
                      style={{ height: 14 }}
                    >
                      <span className="text-muted-foreground font-mono" style={{ fontSize: 8 }}>LOT-0447</span>
                      <div className="bg-success" style={{ width: 5, height: 5 }} />
                    </div>
                    <div className="p-1.5" style={{ fontSize: 9 }}>
                      <div className="text-foreground font-mono" style={{ fontSize: 11, fontWeight: 700 }}>
                        Third Metacarpal
                      </div>
                      <div className="text-muted-foreground font-mono" style={{ fontSize: 9 }}>
                        AMBROSE [3/12]
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-success font-mono" style={{ fontSize: 11, fontWeight: 600 }}>◈ 340</span>
                      </div>
                      <div className="text-muted-foreground font-mono" style={{ fontSize: 9 }}>01:42</div>
                    </div>
                  </div>
                  {/* Annotation lines */}
                  <div className="absolute font-mono" style={{ fontSize: 7, top: 1, right: 0, letterSpacing: 0.5 }}>
                    <div className="text-muted-foreground/60" style={{ marginBottom: 5 }}>LOT ID</div>
                    <div className="text-muted-foreground/60" style={{ marginBottom: 8 }}>RELIC</div>
                    <div className="text-muted-foreground/60" style={{ marginBottom: 5 }}>SAINT</div>
                    <div className="text-accent/70" style={{ marginBottom: 5 }}>BID</div>
                    <div className="text-muted-foreground/60">TIMER</div>
                  </div>
                </div>

                {/* Status indicators */}
                <div>
                  <div className="text-muted-foreground font-mono mb-1.5" style={{ fontSize: 8, letterSpacing: 1.5 }}>
                    STATUS
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { color: 'bg-success', label: 'WINNING', desc: 'your bid leads' },
                      { color: 'bg-destructive', label: 'OUTBID', desc: 'bid again or lose' },
                      { color: 'bg-muted-foreground/40', label: 'UNBID', desc: 'no bid placed' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-2">
                        <div className={s.color} style={{ width: 5, height: 5, flexShrink: 0 }} />
                        <span className="text-foreground font-mono" style={{ fontSize: 9, fontWeight: 600, width: 52 }}>
                          {s.label}
                        </span>
                        <span className="text-muted-foreground font-mono" style={{ fontSize: 9 }}>
                          {s.desc}
                        </span>
                      </div>
                    ))}
                    {/* Closing + outbid dual state */}
                    <div className="flex items-center gap-2">
                      <div className="bg-accent" style={{ width: 5, height: 5, flexShrink: 0 }} />
                      <span className="text-foreground font-mono" style={{ fontSize: 9, fontWeight: 600, width: 52 }}>
                        CLOSING
                      </span>
                      <span className="text-muted-foreground font-mono" style={{ fontSize: 9 }}>
                        {'< 10s left'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2" style={{ marginLeft: 7 }}>
                      <div style={{ width: 5, height: 5, flexShrink: 0, background: 'linear-gradient(135deg, hsl(var(--accent)) 50%, hsl(var(--destructive)) 50%)' }} />
                      <span className="text-foreground font-mono" style={{ fontSize: 9, fontWeight: 600, width: 52 }}>
                        <span className="text-accent">CLOS</span><span className="text-destructive">+OUT</span>
                      </span>
                      <span className="text-muted-foreground font-mono" style={{ fontSize: 9 }}>
                        closing AND outbid
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ COLUMN 2: OPERATIONS ═══ */}
            <div className="border-r border-cell-border flex flex-col">
              <SectionHeader label="02" title="OPERATIONS" />

              <div className="p-3 flex flex-col gap-3 flex-1">
                {/* Bid flow */}
                <div>
                  <div className="text-muted-foreground font-mono mb-1.5" style={{ fontSize: 8, letterSpacing: 1.5 }}>
                    BID FLOW
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { n: '1', text: 'Click a cell to select it' },
                      { n: '2', text: 'Bid panel opens — type amount or use quick-bid' },
                      { n: '3', text: 'Press BID or Enter to confirm' },
                    ].map(step => (
                      <div key={step.n} className="flex gap-2 items-start">
                        <div
                          className="bg-primary text-primary-foreground font-mono flex items-center justify-center shrink-0"
                          style={{ width: 16, height: 16, fontSize: 9, fontWeight: 600 }}
                        >
                          {step.n}
                        </div>
                        <span className="text-foreground font-mono" style={{ fontSize: 10, lineHeight: '16px' }}>
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock bid bar */}
                <div>
                  <div className="text-muted-foreground font-mono mb-1" style={{ fontSize: 7, letterSpacing: 1 }}>
                    BID PANEL
                  </div>
                  <div className="border border-accent/40 bg-cell-titlebar px-2 flex items-center gap-1.5" style={{ height: 24, fontSize: 9 }}>
                    <span className="text-accent font-mono" style={{ fontWeight: 600, fontSize: 8 }}>LOT-0447</span>
                    <span className="text-muted-foreground font-mono">│</span>
                    <span className="text-foreground font-mono">◈ 340</span>
                    <span className="text-success font-mono" style={{ fontSize: 8, fontWeight: 600 }}>WIN</span>
                    <span className="text-muted-foreground font-mono">│</span>
                    <div
                      className="bg-background border border-cell-border text-foreground px-1 font-mono"
                      style={{ width: 40, height: 16, fontSize: 9, lineHeight: '16px' }}
                    >
                      350
                    </div>
                    <div
                      className="bg-primary text-primary-foreground px-2 font-mono"
                      style={{ height: 16, fontSize: 8, lineHeight: '16px', letterSpacing: 1, fontWeight: 600 }}
                    >
                      BID
                    </div>
                  </div>
                </div>

                {/* Key info */}
                <div className="border border-accent/20 bg-accent/5 px-2 py-1.5">
                  <p className="text-foreground font-mono" style={{ fontSize: 9, lineHeight: '14px' }}>
                    You're only charged when you <span className="text-success font-bold">win</span>.
                    Outbid? Your ◈ comes back.
                  </p>
                </div>

                {/* Controls */}
                <div>
                  <div className="text-muted-foreground font-mono mb-1.5" style={{ fontSize: 8, letterSpacing: 1.5 }}>
                    CONTROLS
                  </div>
                  <div className="flex flex-col gap-0">
                    {[
                      ['CLICK CELL', 'Select lot for bidding'],
                      ['ENTER', 'Confirm bid'],
                      ['ESC', 'Deselect lot'],
                    ].map(([key, desc]) => (
                      <div
                        key={key}
                        className="flex items-center border-b border-cell-border/30 py-1"
                        style={{ fontSize: 9 }}
                      >
                        <span className="text-accent font-mono" style={{ width: 80, fontWeight: 500, fontSize: 8 }}>
                          {key}
                        </span>
                        <span className="text-muted-foreground font-mono">{desc}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-1.5">
                    <div className="text-muted-foreground font-mono" style={{ fontSize: 7, letterSpacing: 1, marginBottom: 3 }}>
                      QUICK-BID
                    </div>
                    <div className="flex gap-1">
                      {['+10', '+50', '+100'].map(v => (
                        <div
                          key={v}
                          className="border border-cell-border bg-cell-titlebar text-accent font-mono flex items-center justify-center"
                          style={{ height: 18, fontSize: 8, fontWeight: 600, flex: 1 }}
                        >
                          {v}
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground font-mono mt-1" style={{ fontSize: 8, lineHeight: '12px' }}>
                      Increment buttons — add to current bid
                    </p>
                  </div>
                </div>

                {/* Saint tracker */}
                <div>
                  <div className="text-muted-foreground font-mono mb-1.5" style={{ fontSize: 8, letterSpacing: 1.5 }}>
                    SAINT TRACKER
                  </div>
                  <p className="text-foreground font-mono mb-2" style={{ fontSize: 9, lineHeight: '14px' }}>
                    Top bar shows collection progress. Complete all relics of every saint to win.
                  </p>
                  <div className="border border-cell-border bg-cell-titlebar px-2 py-1.5 font-mono" style={{ fontSize: 9 }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-muted-foreground" style={{ width: 56, fontSize: 8 }}>AMBROSE</span>
                      <div className="flex gap-px flex-1">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div
                            key={i}
                            className={i < 3 ? 'bg-primary' : 'bg-muted/30'}
                            style={{ flex: 1, height: 4 }}
                          />
                        ))}
                      </div>
                      <span className="text-primary" style={{ fontSize: 8 }}>3/12</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground" style={{ width: 56, fontSize: 8 }}>LUCIA</span>
                      <div className="flex gap-px flex-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="bg-primary" style={{ flex: 1, height: 4 }} />
                        ))}
                      </div>
                      <span className="text-accent" style={{ fontSize: 8 }}>10/10 ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ COLUMN 3: MARKET FORCES ═══ */}
            <div className="flex flex-col">
              <SectionHeader label="03" title="MARKET FORCES" />

              <div className="p-3 flex flex-col gap-3 flex-1">
                {/* AI Bidders */}
                <div>
                  <div className="text-muted-foreground font-mono mb-1.5" style={{ fontSize: 8, letterSpacing: 1.5 }}>
                    AI BIDDERS
                  </div>
                  <p className="text-foreground font-mono" style={{ fontSize: 9, lineHeight: '14px' }}>
                    Automated brokers compete for every relic. They bid more aggressively as lots near expiry.
                    When outbid, your cell <span className="text-destructive font-bold">flashes red</span>.
                  </p>
                </div>

                {/* Heresy */}
                <div className="border border-accent/20 bg-accent/5 p-2">
                  <div className="text-accent font-mono mb-1" style={{ fontSize: 8, letterSpacing: 1.5 }}>
                    HERESY EVENTS
                  </div>
                  <p className="text-foreground font-mono" style={{ fontSize: 9, lineHeight: '14px' }}>
                    When the terminal feed reports heresy, the market <span className="text-accent font-bold">freezes 6–10s</span>:
                  </p>
                  <div className="mt-1.5 flex flex-col gap-0.5 font-mono" style={{ fontSize: 9 }}>
                    <div className="text-foreground">→ AI bidders <span className="text-accent">pause</span></div>
                    <div className="text-foreground">→ Timers slow</div>
                    <div className="text-success">→ Your window to bid unopposed</div>
                  </div>
                </div>

                {/* Mock tribunal bar */}
                <div
                  className="border border-destructive/30 bg-destructive/5 px-2 flex items-center justify-between font-mono"
                  style={{ height: 20, fontSize: 8 }}
                >
                  <span className="text-destructive" style={{ fontWeight: 600, letterSpacing: 1 }}>
                    ▓ TRIBUNAL DELAY ▓
                  </span>
                  <span className="text-muted-foreground">MARKET FROZEN</span>
                </div>

                {/* Sects */}
                <div>
                  <div className="text-muted-foreground font-mono mb-1.5" style={{ fontSize: 8, letterSpacing: 1.5 }}>
                    SECTS
                  </div>
                  <div className="flex flex-col gap-1">
                    {[
                      { name: 'FLAGELLANTS', cls: 'bg-sect-red' },
                      { name: 'CATHARI', cls: 'bg-sect-cyan' },
                      { name: 'GNOSTIC ORDER', cls: 'bg-sect-magenta' },
                      { name: 'BOGOMILS', cls: 'bg-sect-lime' },
                      { name: 'WALDENSIANS', cls: 'bg-sect-orange' },
                    ].map(s => (
                      <div key={s.name} className="flex items-center gap-2">
                        <div className={s.cls} style={{ width: 5, height: 5, flexShrink: 0 }} />
                        <span className="text-muted-foreground font-mono" style={{ fontSize: 8 }}>
                          {s.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terminal feed hint */}
                <div>
                  <div className="text-muted-foreground font-mono mb-1.5" style={{ fontSize: 8, letterSpacing: 1.5 }}>
                    TERMINAL FEED
                  </div>
                  <div className="border border-cell-border bg-background p-1.5 font-mono" style={{ fontSize: 8, lineHeight: '13px' }}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="bg-destructive" style={{ width: 3, height: 3 }} />
                      <span className="text-destructive">[INTERCEPT] CATHARI cipher detected</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="bg-muted-foreground/30" style={{ width: 3, height: 3 }} />
                      <span className="text-muted-foreground">› Provenance oracle responding</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="bg-success" style={{ width: 3, height: 3 }} />
                      <span className="text-success">LOT-0312 WON — Femur ◈ 210</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="bg-muted-foreground/30" style={{ width: 3, height: 3 }} />
                      <span className="text-muted-foreground">› Sanctity hash: valid</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground font-mono mt-1" style={{ fontSize: 8, lineHeight: '12px' }}>
                    Watch the feed. It tells you when heresy hits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div
          className="flex items-center justify-between px-3 border-t border-cell-border bg-cell-titlebar shrink-0"
          style={{ height: 28 }}
        >
          <div className="flex items-center gap-4 font-mono" style={{ fontSize: 9 }}>
            <span className="text-accent" style={{ fontWeight: 600 }}>BUDGET: ◈ 3,000</span>
            <span className="text-muted-foreground/40">│</span>
            <span className="text-muted-foreground">NO REFILLS</span>
            <span className="text-muted-foreground/40">│</span>
            <span className="text-muted-foreground">COMPLETE ALL 8 SAINTS TO WIN</span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-primary-foreground font-mono bg-primary hover:brightness-110"
            style={{ fontSize: 9, height: 20, paddingLeft: 12, paddingRight: 12, letterSpacing: 1, fontWeight: 600 }}
          >
            ENTER THE EXCHANGE →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SECTION HEADER COMPONENT ── */
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 border-b border-cell-border bg-cell-titlebar shrink-0"
      style={{ height: 22 }}
    >
      <span className="text-primary font-mono" style={{ fontSize: 9, fontWeight: 600 }}>{label}</span>
      <span className="text-muted-foreground font-mono" style={{ fontSize: 9, letterSpacing: 1.5, fontWeight: 500 }}>
        {title}
      </span>
    </div>
  );
}

import { useState, useCallback } from 'react';

interface TutorialOverlayProps {
  onDismiss: () => void;
}

const PAGES = [
  {
    title: 'HOLY_OPS.EXE',
    subtitle: 'RELIC EXCHANGE TERMINAL',
    content: (
      <div className="flex flex-col items-center gap-6">
        <div className="text-[80px] leading-none">✝</div>
        <p className="text-foreground text-center" style={{ fontSize: 13, lineHeight: '22px', maxWidth: 400 }}>
          You are a relic broker on the last open exchange. Sacred fragments of saints
          appear as auction lots on a living grid. Your mission: <span className="text-accent">assemble complete saints</span> by
          winning every relic that belongs to them.
        </p>
        <div className="font-mono text-muted-foreground text-center" style={{ fontSize: 10, marginTop: 8 }}>
          You have a fixed budget. No refills. No mercy.<br/>
          Spend wisely. Watch everything.
        </div>
      </div>
    ),
  },
  {
    title: 'THE GRID',
    subtitle: 'YOUR BATTLEFIELD',
    content: (
      <div className="flex flex-col gap-5">
        <div className="flex gap-3 items-start">
          <div className="border border-cell-border bg-cell p-2 shrink-0" style={{ width: 180, fontSize: 10 }}>
            <div className="bg-cell-titlebar px-1 mb-1 flex items-center justify-between" style={{ height: 14 }}>
              <span className="text-muted-foreground text-[8px]">LOT-0447</span>
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
            </div>
            <div className="text-foreground font-mono" style={{ fontSize: 11 }}>Third Metacarpal</div>
            <div className="text-muted-foreground">AMBROSE [3/12]</div>
            <div className="text-success mt-1">◈ 340</div>
            <div className="text-muted-foreground">01:42</div>
          </div>
          <div className="flex flex-col gap-2" style={{ fontSize: 12, lineHeight: '20px' }}>
            <p className="text-foreground">
              Each cell is a <span className="text-primary">live auction lot</span>. The grid constantly reshuffles — 
              important lots grow larger, quiet ones compress.
            </p>
            <p className="text-muted-foreground" style={{ fontSize: 11 }}>
              Cells show: relic name, saint association, current bid, and time remaining.
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center" style={{ fontSize: 10 }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-foreground">Winning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <span className="text-foreground">Outbid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-foreground">Closing soon</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground" />
            <span className="text-foreground">No bid placed</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'BIDDING',
    subtitle: 'HOW TO ACQUIRE RELICS',
    content: (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3" style={{ fontSize: 12, lineHeight: '22px' }}>
          <div className="flex gap-3 items-start">
            <span className="text-accent font-mono shrink-0" style={{ fontSize: 18, lineHeight: '22px' }}>1</span>
            <p className="text-foreground">
              <span className="text-primary">Click any cell</span> on the grid to select it.
              The cell highlights with a gold border.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-accent font-mono shrink-0" style={{ fontSize: 18, lineHeight: '22px' }}>2</span>
            <p className="text-foreground">
              The <span className="text-primary">bid bar</span> appears at the bottom of the screen
              showing lot details and a bid input pre-filled with the minimum.
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-accent font-mono shrink-0" style={{ fontSize: 18, lineHeight: '22px' }}>3</span>
            <p className="text-foreground">
              Enter your amount and hit <span className="text-primary">BID</span> or press Enter. 
              Your bid must exceed the current price.
            </p>
          </div>
        </div>

        {/* Mock bid bar */}
        <div className="border border-accent bg-cell-titlebar flex items-center gap-2 px-2 mx-auto" style={{ height: 28, fontSize: 10, width: '90%' }}>
          <span className="text-accent">LOT-0447</span>
          <span className="text-foreground">Third Metacarpal</span>
          <span className="text-muted-foreground">│</span>
          <span className="text-foreground">◈ 340</span>
          <span className="text-success text-[9px]">WINNING</span>
          <span className="text-muted-foreground">│</span>
          <span className="text-muted-foreground">◈</span>
          <div className="bg-input border border-cell-border text-foreground px-1" style={{ width: 50, height: 18, fontSize: 10, lineHeight: '18px' }}>
            350
          </div>
          <div className="bg-primary text-primary-foreground px-2" style={{ height: 18, fontSize: 9, lineHeight: '18px', letterSpacing: 1 }}>
            BID
          </div>
        </div>

        <p className="text-muted-foreground text-center" style={{ fontSize: 10 }}>
          Press ESC to deselect a lot. You can bid on as many lots as you can afford.
        </p>
      </div>
    ),
  },
  {
    title: 'THE COMPETITION',
    subtitle: 'YOU ARE NOT ALONE',
    content: (
      <div className="flex flex-col gap-5" style={{ fontSize: 12, lineHeight: '22px' }}>
        <p className="text-foreground text-center">
          Automated bidders compete for every relic. They bid more aggressively
          as lots near expiry. When you're outbid, the cell <span className="text-destructive">flashes red</span>.
        </p>

        <div className="border border-cell-border bg-cell p-3 mx-auto cell-flash-outbid" style={{ width: 200, fontSize: 10 }}>
          <div className="text-foreground font-mono" style={{ fontSize: 11 }}>Left Femur Fragment</div>
          <div className="text-muted-foreground">AMBROSE [3/12]</div>
          <div className="flex gap-2 mt-1">
            <span className="text-destructive">◈ 420</span>
            <span className="text-destructive text-[9px]">yours: ◈ 380</span>
          </div>
          <div className="text-destructive">00:08</div>
        </div>

        <p className="text-foreground text-center">
          There are no notifications. <span className="text-accent">You must watch the grid.</span> If you
          miss the flash, you miss the lot.
        </p>
      </div>
    ),
  },
  {
    title: 'TRIBUNAL FEED',
    subtitle: 'HERESY & MARKET INTERFERENCE',
    content: (
      <div className="flex flex-col gap-4" style={{ fontSize: 12, lineHeight: '22px' }}>
        <p className="text-foreground text-center">
          The terminal on the right scrolls reports from the <span className="text-primary">Holy Tribunal</span>.
          Most are routine. But when a <span className="text-accent">heresy report</span> appears from one 
          of the underground sects...
        </p>

        <div className="border border-cell-border bg-cell p-2 mx-auto font-mono" style={{ width: 280, fontSize: 9, lineHeight: '15px' }}>
          <div className="flex items-start gap-1.5 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1 shrink-0" />
            <span className="text-muted-foreground">&gt; Reliquary index updated</span>
          </div>
          <div className="flex items-start gap-1.5 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1 shrink-0" />
            <span className="text-muted-foreground">&gt; Provenance oracle responding</span>
          </div>
          <div className="flex items-start gap-1.5 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-sect-cyan mt-1 shrink-0" />
            <span className="text-sect-cyan">[INTERCEPT] CATHARI communiqué re: relic substitution</span>
          </div>
          <div className="flex items-start gap-1.5 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-sect-magenta mt-1 shrink-0" />
            <span className="text-sect-magenta">[BREACH] GNOSTIC ORDER proxy bid network flagged</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-accent text-center font-mono" style={{ fontSize: 11 }}>
            ▓ HERESY DETECTED — MARKET DELAY ▓
          </p>
          <p className="text-foreground text-center" style={{ fontSize: 11 }}>
            The market <span className="text-accent">slows down for ~4 seconds</span>. Timers tick at half speed.
            AI bidders pause entirely. Use these windows to bid unopposed.
          </p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap" style={{ fontSize: 9 }}>
          {[
            { name: 'FLAGELLANTS', cls: 'bg-sect-red' },
            { name: 'CATHARI', cls: 'bg-sect-cyan' },
            { name: 'GNOSTIC ORDER', cls: 'bg-sect-magenta' },
            { name: 'BOGOMILS', cls: 'bg-sect-lime' },
            { name: 'WALDENSIANS', cls: 'bg-sect-orange' },
          ].map(s => (
            <div key={s.name} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${s.cls}`} />
              <span className="text-muted-foreground">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'SAINTS',
    subtitle: 'YOUR COLLECTION',
    content: (
      <div className="flex flex-col gap-5" style={{ fontSize: 12, lineHeight: '22px' }}>
        <p className="text-foreground text-center">
          The top bar tracks your progress toward completing each saint.
          Collect <span className="text-primary">every relic</span> of a saint to complete them.
        </p>

        <div className="border border-cell-border bg-cell-titlebar px-3 py-2 mx-auto font-mono" style={{ fontSize: 10, lineHeight: '18px' }}>
          <div className="flex gap-4">
            <span className="text-muted-foreground">
              AMBROSE <span className="text-primary">███░░░░░░░░░</span> 3/12
            </span>
            <span className="text-muted-foreground">
              LUCIA <span className="text-primary">██████░░░░</span> 6/10
            </span>
          </div>
        </div>

        <p className="text-foreground text-center">
          When a saint is completed, the exchange pauses. Their name is rendered
          across the grid. A moment of stillness. Then the market resumes.
        </p>

        <div className="flex flex-col items-center gap-1 mt-2">
          <div className="text-accent font-mono" style={{ fontSize: 10, letterSpacing: 6 }}>
            SAINT COMPLETE
          </div>
          <div className="text-primary font-mono" style={{ fontSize: 28, letterSpacing: 3 }}>
            AMBROSE
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'REMEMBER',
    subtitle: 'FINAL BRIEFING',
    content: (
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col gap-3" style={{ fontSize: 12, lineHeight: '22px', maxWidth: 420 }}>
          <div className="flex gap-3 items-start">
            <span className="text-accent font-mono shrink-0">◈</span>
            <p className="text-foreground">Your budget is <span className="text-accent">◈ 5,000</span>. When it's gone, it's gone.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-accent font-mono shrink-0">◈</span>
            <p className="text-foreground">Currency is only deducted when you <span className="text-success">win</span> a lot (timer hits zero and you're the highest bidder).</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-accent font-mono shrink-0">◈</span>
            <p className="text-foreground">New lots appear constantly. The grid never stops. Neither should you.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-accent font-mono shrink-0">◈</span>
            <p className="text-foreground">Watch the tribunal feed for <span className="text-accent">heresy slowdowns</span> — they're your edge.</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-accent font-mono shrink-0">◈</span>
            <p className="text-foreground">Refresh the page to start a new game. There is no save.</p>
          </div>
        </div>

        <div className="text-muted-foreground font-mono text-center mt-4" style={{ fontSize: 10 }}>
          The grid is already moving behind this screen.<br />
          Close this window when you're ready.
        </div>
      </div>
    ),
  },
];

export default function TutorialOverlay({ onDismiss }: TutorialOverlayProps) {
  const [page, setPage] = useState(0);

  const current = PAGES[page];
  const isLast = page === PAGES.length - 1;
  const isFirst = page === 0;

  const handleNext = useCallback(() => {
    if (isLast) {
      onDismiss();
    } else {
      setPage(p => p + 1);
    }
  }, [isLast, onDismiss]);

  const handleBack = useCallback(() => {
    setPage(p => Math.max(0, p - 1));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'hsl(240 12% 4% / 0.92)' }}>
      <div className="border border-cell-border bg-cell flex flex-col" style={{ width: 560, maxHeight: '85vh' }}>
        {/* Title bar */}
        <div className="flex items-center justify-between bg-cell-titlebar px-2 border-b border-cell-border shrink-0" style={{ height: 20 }}>
          <span className="text-[9px] text-muted-foreground font-mono">BRIEFING.EXE — Page {page + 1}/{PAGES.length}</span>
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground font-mono"
            style={{ fontSize: 10 }}
          >
            [×]
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-4">
          <div className="text-center">
            <h1 className="text-primary font-mono" style={{ fontSize: 22, letterSpacing: 4 }}>
              {current.title}
            </h1>
            <div className="text-muted-foreground font-mono mt-1" style={{ fontSize: 9, letterSpacing: 3 }}>
              {current.subtitle}
            </div>
          </div>

          <div className="border-t border-cell-border w-full my-2" />

          <div className="w-full">{current.content}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-cell-border bg-cell-titlebar shrink-0">
          {/* Page dots */}
          <div className="flex gap-1.5">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`rounded-full transition-colors ${i === page ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                style={{ width: 6, height: 6 }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground font-mono px-3 border border-cell-border bg-cell"
                style={{ fontSize: 10, height: 24 }}
              >
                ← BACK
              </button>
            )}
            <button
              onClick={handleNext}
              className="text-primary-foreground font-mono px-4 bg-primary hover:brightness-110"
              style={{ fontSize: 10, height: 24, letterSpacing: 1 }}
            >
              {isLast ? 'ENTER THE EXCHANGE →' : 'NEXT →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

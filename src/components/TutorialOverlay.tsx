import { useState, useCallback } from 'react';

interface TutorialOverlayProps {
  onDismiss: () => void;
}

const PAGES = [
  {
    title: 'HOLY_OPS.EXE',
    subtitle: 'RELIC EXCHANGE TERMINAL v0.1',
    content: (
      <div className="flex flex-col items-center gap-6">
        <div className="text-[72px] leading-none" style={{ filter: 'drop-shadow(0 0 20px hsl(45 100% 50% / 0.4))' }}>✝</div>
        <p className="text-foreground text-center" style={{ fontSize: 14, lineHeight: '24px', maxWidth: 420 }}>
          Welcome to the last open relic exchange. You are a broker of sacred bones,
          teeth, and splinters — bidding against machines and zealots for the scattered
          remains of saints.
        </p>
        <div className="border border-accent/30 bg-accent/5 px-4 py-3 text-center" style={{ maxWidth: 380 }}>
          <p className="text-accent font-mono" style={{ fontSize: 13 }}>
            YOUR GOAL
          </p>
          <p className="text-foreground mt-1" style={{ fontSize: 12, lineHeight: '20px' }}>
            Collect <span className="text-accent font-bold">every relic</span> belonging to a saint
            to complete them. Complete as many saints as you can before your money runs out.
          </p>
        </div>
        <div className="text-muted-foreground text-center font-mono" style={{ fontSize: 10 }}>
          Budget: ◈ 5,000 · No refills · No mercy
        </div>
      </div>
    ),
  },
  {
    title: 'THE GRID',
    subtitle: 'READING THE BATTLEFIELD',
    content: (
      <div className="flex flex-col gap-5">
        <p className="text-foreground text-center" style={{ fontSize: 12, lineHeight: '20px' }}>
          The grid is a live auction floor. Each rectangle is a <span className="text-primary">lot</span> — 
          a relic for sale. Cells resize dynamically: hot lots grow, quiet ones shrink.
        </p>

        {/* Annotated mock cell */}
        <div className="mx-auto relative" style={{ width: 280 }}>
          <div className="border border-cell-border bg-cell" style={{ width: 240 }}>
            <div className="bg-cell-titlebar px-1.5 flex items-center justify-between" style={{ height: 16 }}>
              <span className="text-muted-foreground text-[9px]">LOT-0447</span>
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
            </div>
            <div className="p-2" style={{ fontSize: 10 }}>
              <div className="text-foreground font-mono" style={{ fontSize: 12, fontWeight: 700 }}>Third Metacarpal</div>
              <div className="text-muted-foreground">AMBROSE [3/12]</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-success">◈ 340</span>
              </div>
              <div className="text-muted-foreground font-mono">01:42</div>
            </div>
          </div>

          {/* Annotations */}
          <div className="absolute font-mono text-[8px]" style={{ top: 2, left: 252 }}>
            <div className="text-accent">← LOT ID</div>
          </div>
          <div className="absolute font-mono text-[8px]" style={{ top: 20, left: 252 }}>
            <div className="text-accent">← RELIC NAME</div>
          </div>
          <div className="absolute font-mono text-[8px]" style={{ top: 36, left: 252 }}>
            <div className="text-accent">← SAINT [owned/total]</div>
          </div>
          <div className="absolute font-mono text-[8px]" style={{ top: 52, left: 252 }}>
            <div className="text-accent">← CURRENT BID</div>
          </div>
          <div className="absolute font-mono text-[8px]" style={{ top: 68, left: 252 }}>
            <div className="text-accent">← TIME LEFT</div>
          </div>
        </div>

        {/* Status legend */}
        <div className="border border-cell-border bg-cell-titlebar p-3 mx-auto" style={{ fontSize: 11 }}>
          <div className="text-muted-foreground font-mono text-[9px] mb-2" style={{ letterSpacing: 2 }}>STATUS INDICATORS</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" style={{ boxShadow: '0 0 6px hsl(142 72% 45%)' }} />
              <span className="text-foreground">You're <span className="text-success font-bold">winning</span> this lot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" style={{ boxShadow: '0 0 6px hsl(0 72% 51%)' }} />
              <span className="text-foreground">You've been <span className="text-destructive font-bold">outbid</span> — bid again or lose it</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" style={{ boxShadow: '0 0 6px hsl(45 100% 50%)' }} />
              <span className="text-foreground"><span className="text-accent font-bold">Closing soon</span> — under 15 seconds left</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground" />
              <span className="text-foreground">You haven't bid on this one yet</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'HOW TO BID',
    subtitle: 'STEP BY STEP',
    content: (
      <div className="flex flex-col gap-5">
        {/* Step-by-step with visuals */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="bg-primary text-primary-foreground font-mono flex items-center justify-center shrink-0" style={{ width: 28, height: 28, fontSize: 14 }}>1</div>
            <div>
              <p className="text-foreground" style={{ fontSize: 12, lineHeight: '20px' }}>
                <span className="text-primary font-bold">Click any cell</span> on the grid to select it.
                A gold border appears around your chosen lot.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="bg-primary text-primary-foreground font-mono flex items-center justify-center shrink-0" style={{ width: 28, height: 28, fontSize: 14 }}>2</div>
            <div>
              <p className="text-foreground" style={{ fontSize: 12, lineHeight: '20px' }}>
                The <span className="text-primary font-bold">bid bar</span> appears at the bottom with lot info and a
                pre-filled minimum bid amount.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="bg-primary text-primary-foreground font-mono flex items-center justify-center shrink-0" style={{ width: 28, height: 28, fontSize: 14 }}>3</div>
            <div>
              <p className="text-foreground" style={{ fontSize: 12, lineHeight: '20px' }}>
                Type your amount (must beat current bid) and press <span className="text-primary font-bold">BID</span> or hit Enter.
              </p>
            </div>
          </div>
        </div>

        {/* Visual mock of bid bar */}
        <div className="mx-auto w-full" style={{ maxWidth: 460 }}>
          <div className="text-muted-foreground font-mono text-[8px] mb-1" style={{ letterSpacing: 2 }}>↓ BID BAR (BOTTOM OF SCREEN)</div>
          <div className="border border-accent bg-cell-titlebar flex items-center gap-2 px-3" style={{ height: 32, fontSize: 10 }}>
            <span className="text-accent font-bold">LOT-0447</span>
            <span className="text-foreground">Third Metacarpal</span>
            <span className="text-muted-foreground">│</span>
            <span className="text-foreground">current: ◈ 340</span>
            <span className="text-success text-[9px] font-bold">WINNING</span>
            <span className="text-muted-foreground">│</span>
            <span className="text-muted-foreground">◈</span>
            <div className="bg-input border border-cell-border text-foreground px-1.5 font-mono" style={{ width: 55, height: 20, fontSize: 11, lineHeight: '20px' }}>
              350
            </div>
            <div className="bg-primary text-primary-foreground px-3 font-mono" style={{ height: 20, fontSize: 10, lineHeight: '20px', letterSpacing: 1 }}>
              BID
            </div>
          </div>
        </div>

        <div className="border border-muted/20 bg-muted/5 px-3 py-2 text-center" style={{ fontSize: 11 }}>
          <span className="text-accent">💡</span> You're only charged when you <span className="text-success font-bold">win</span>.
          Outbid? Your ◈ comes back. Bid freely.
        </div>
      </div>
    ),
  },
  {
    title: 'RIVALS & HERESY',
    subtitle: 'THE CHAOS',
    content: (
      <div className="flex flex-col gap-5" style={{ fontSize: 12, lineHeight: '22px' }}>
        {/* AI bidders */}
        <div className="border border-cell-border bg-cell p-3">
          <div className="text-primary font-mono text-[9px] mb-2" style={{ letterSpacing: 2 }}>AI BIDDERS</div>
          <p className="text-foreground" style={{ fontSize: 12 }}>
            Automated brokers compete for every relic. They bid more aggressively as lots
            near expiry. When outbid, your cell <span className="text-destructive font-bold">flashes red</span> — 
            if you miss it, you lose.
          </p>
        </div>

        {/* Heresy mechanic */}
        <div className="border border-accent/30 bg-accent/5 p-3">
          <div className="text-accent font-mono text-[9px] mb-2" style={{ letterSpacing: 2 }}>HERESY EVENTS</div>
          <p className="text-foreground" style={{ fontSize: 12 }}>
            The terminal feed (right panel) scrolls reports from the Holy Tribunal.
            When a <span className="text-accent font-bold">heresy report</span> appears, the market 
            <span className="text-accent font-bold"> freezes for ~4 seconds</span>:
          </p>
          <ul className="mt-2 flex flex-col gap-1 text-foreground" style={{ fontSize: 11 }}>
            <li>→ Timers tick at half speed</li>
            <li>→ AI bidders <span className="text-accent">pause entirely</span></li>
            <li>→ <span className="text-success">Your window to bid unopposed</span></li>
          </ul>
        </div>

        {/* Sects */}
        <div className="flex gap-3 justify-center flex-wrap" style={{ fontSize: 9 }}>
          {[
            { name: 'FLAGELLANTS', cls: 'bg-sect-red' },
            { name: 'CATHARI', cls: 'bg-sect-cyan' },
            { name: 'GNOSTIC ORDER', cls: 'bg-sect-magenta' },
            { name: 'BOGOMILS', cls: 'bg-sect-lime' },
            { name: 'WALDENSIANS', cls: 'bg-sect-orange' },
          ].map(s => (
            <div key={s.name} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full ${s.cls}`} style={{ boxShadow: '0 0 4px currentColor' }} />
              <span className="text-muted-foreground font-mono">{s.name}</span>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground text-center font-mono" style={{ fontSize: 10 }}>
          Watch the terminal. Exploit the chaos.
        </p>
      </div>
    ),
  },
  {
    title: 'COMPLETING SAINTS',
    subtitle: 'THE ENDGAME',
    content: (
      <div className="flex flex-col gap-5" style={{ fontSize: 12, lineHeight: '22px' }}>
        <p className="text-foreground text-center">
          The <span className="text-primary font-bold">saint tracker</span> at the top shows your collection progress.
          Each saint has a set number of relics scattered across the exchange.
        </p>

        {/* Mock saint tracker */}
        <div className="border border-cell-border bg-cell-titlebar px-4 py-2 mx-auto font-mono" style={{ fontSize: 10, lineHeight: '20px' }}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground" style={{ width: 80 }}>AMBROSE</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`${i < 3 ? 'bg-primary' : 'bg-muted'}`} style={{ width: 12, height: 6 }} />
                ))}
              </div>
              <span className="text-primary">3/12</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground" style={{ width: 80 }}>LUCIA</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`${i < 10 ? 'bg-primary' : 'bg-muted'}`} style={{ width: 12, height: 6 }} />
                ))}
              </div>
              <span className="text-accent">10/10 ✓</span>
            </div>
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-3 text-center">
          <p className="text-accent font-mono" style={{ fontSize: 11 }}>
            When you complete a saint, the screen pauses:
          </p>
          <div className="mt-3 mb-1">
            <div className="text-accent font-mono" style={{ fontSize: 9, letterSpacing: 6 }}>SAINT COMPLETE</div>
            <div className="text-primary font-mono" style={{ fontSize: 32, letterSpacing: 3 }}>LUCIA</div>
          </div>
          <p className="text-muted-foreground" style={{ fontSize: 10 }}>
            A moment of reverence. Then the market resumes.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: 'QUICK REFERENCE',
    subtitle: 'REMEMBER THIS',
    content: (
      <div className="flex flex-col items-center gap-4">
        <div className="w-full border border-cell-border bg-cell">
          <table className="w-full font-mono" style={{ fontSize: 11 }}>
            <tbody>
              {[
                ['Click cell', 'Select lot for bidding'],
                ['BID / Enter', 'Place your bid'],
                ['ESC / click again', 'Deselect lot'],
                ['Green dot', "You're winning"],
                ['Red dot', "You've been outbid"],
                ['Gold dot', 'Lot closing in < 15s'],
                ['Red flash', 'Someone just outbid you'],
                ['Gold flash', 'You just won a lot'],
                ['▓ TRIBUNAL DELAY ▓', 'Market frozen — bid now!'],
                ['◈ 5,000', 'Your total budget'],
              ].map(([key, desc], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-cell' : 'bg-cell-titlebar'}>
                  <td className="text-accent px-3 py-1.5 border-b border-cell-border" style={{ width: 170 }}>{key}</td>
                  <td className="text-foreground px-3 py-1.5 border-b border-cell-border">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-muted-foreground font-mono text-center mt-2" style={{ fontSize: 10, lineHeight: '18px' }}>
          The grid is already moving behind this screen.<br />
          New lots are spawning. AI bidders are placing bids.<br />
          <span className="text-accent">Close this window when you're ready.</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95">
      <div className="border border-cell-border bg-cell flex flex-col" style={{ width: 580, maxHeight: '88vh' }}>
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

          <div className="border-t border-cell-border w-full my-1" />

          <div className="w-full">{current.content}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-cell-border bg-cell-titlebar shrink-0">
          <div className="flex gap-1.5">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`rounded-full transition-colors ${i === page ? 'bg-primary' : i < page ? 'bg-primary/40' : 'bg-muted-foreground/30'}`}
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

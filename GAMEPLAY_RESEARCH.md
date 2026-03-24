# HOLY_OPS.EXE — Gameplay Mechanics Research Report

**Team:** Three game design researchers
**Date:** 2026-03-22
**Build analyzed:** Relic Exchange v0.1 (current `main` branch)

---

## 1. HERESY EVENTS

### How It Works Now

The heresy system lives in two places: `src/game/heresy.ts` defines five sects (Flagellants, Cathari, Gnostic Order, Bogomils, Waldensians) and a pool of 15 message templates, while `src/pages/Index.tsx` handles the timing and market effect. Every 2.5 seconds (`FEED_INTERVAL = 2500`), the game rolls a 35% chance (`HERESY_CHANCE = 0.35`) to generate a heresy report instead of a system message. When heresy fires, it sets `slowedUntil = Date.now() + 4000`, which does two things:

1. **Tick skipping** — the game tick (`1000ms`) alternates between firing and skipping, effectively halving the speed of lot timers.
2. **AI bid suppression** — the `aiBids` interval checks `now < slowedUntil` and returns early if true, completely freezing AI competition for 4 seconds.

That is the entire mechanical effect. There is no sect differentiation. A Flagellant event and a Cathar event do exactly the same thing. The sect name and color appear in the terminal feed, but the game engine treats every heresy identically.

### What Works

The 4-second freeze creates a genuine buy window. When a player sees "HERESY DETECTED -- MARKET DELAY" in the title bar and understands that AI bidders are frozen, they have a real tactical moment: bid now while nobody is competing. This is the single best moment-to-moment mechanic in the current game. The pulse animation on the terminal feed header adds urgency without being obnoxious.

### What Doesn't Work

**The freeze is binary and unreadable.** The player cannot distinguish between sects mechanically, so there is no reason to read the terminal feed carefully. Every heresy message means the same thing: "bid now." There is no pattern to learn, no expertise to develop. This directly contradicts the game's own aesthetic promise -- a terminal full of scrolling intelligence that rewards attention.

**The tick-skipping implementation is crude.** The `tickSkip.current = !tickSkip.current` toggle means lot timers lose exactly half their ticks during a slowdown. But because the tick interval is 1 second and the slowdown is 4 seconds, the player sees 2 ticks lost out of 4. This is not really perceptible as "market freeze" -- it feels more like a slight stutter. The lot timers still count down, just slower. The fiction says "TRIBUNAL DELAY" but the experience says "minor lag."

**4 seconds is too short to exploit meaningfully.** By the time the player reads the heresy message, processes it, scans the grid for opportunities, selects a lot, and places a bid, the freeze is already over. A skilled player might get one bid in. The window rewards reflexes, not strategy.

**Heresy frequency is too high for the effect to feel special.** At a 35% chance every 2.5 seconds, a heresy event fires roughly every 7 seconds on average. With a 4-second freeze duration, the market is in "heresy mode" for more than half the total play time. When something happens constantly, it stops being an event.

### Proposals

**Proposal 1: Sect-specific market effects.** Each sect should affect a subset of saints, not the whole market. This creates a learnable mapping that rewards terminal reading:

| Sect | Target Saints | Price Effect | Duration |
|------|--------------|-------------|----------|
| FLAGELLANTS | SEBASTIAN, FRANCIS | AI bids +40% on those saints (panic buying of penitential relics) | 6s |
| CATHARI | CATHERINE, TERESA | AI bids frozen on those saints (Cathars reject material relics) | 8s |
| GNOSTIC ORDER | BARTHOLOMEW, AMBROSE | Lot timers on those saints pause entirely | 6s |
| BOGOMILS | AGATHA, LUCIA | New lots for those saints cannot spawn | 10s |
| WALDENSIANS | FRANCIS, LUCIA | Starting bids on new lots for those saints reduced by 30% | 8s |

The player who reads "CATHARI" and immediately knows Catherine and Teresa lots are uncontested for 8 seconds has a real edge. The player who reads "FLAGELLANTS" knows to avoid bidding on Sebastian right now because AI will overpay. This is the kind of learnable pattern that creates skill expression.

**Proposal 2: Reduce frequency, increase impact.** Change heresy parameters:

```
HERESY_CHANCE = 0.15       // down from 0.35
FEED_INTERVAL = 3500       // down from 2500 (slower feed overall)
HERESY_DURATION = 6000-10000 // up from 4000 (varies by sect)
```

This means heresy fires roughly every 23 seconds instead of every 7 seconds. Each event lasts longer and does more. The terminal feed has more system messages between heresies, making each heresy report stand out visually. The player has time to read, process, and act.

**Proposal 3: Heresy escalation.** Track a `heresyPressure` counter that increments with each event. When pressure reaches thresholds, the next heresy event becomes a "MAJOR HERESY" with doubled effect duration and a more dramatic visual treatment (screen border flash, louder terminal announcement). This creates rising tension over the course of a session without changing the base frequency.

**Proposal 4: Pre-announcement telegraph.** 3-5 seconds before a heresy fires, the terminal should print a warning line: `[SIGNAL] ${sect.name} activity detected in region...` This gives the player time to position -- scan the grid for the affected saints, identify underpriced lots, hover over them. When the heresy fires, they are ready to act. The telegraph is the difference between a mechanic that rewards reflexes and one that rewards preparation.

---

## 2. MARKET FORCES

### How AI Bidding Works Now

The `aiBids` function in `engine.ts` runs every 3 seconds (`AI_BID_INTERVAL = 3000`). It iterates over all active lots and rolls a probability check per lot:

- Lots with <10 seconds remaining: 20% chance of AI bid
- Lots with <30 seconds remaining: 8% chance
- All other lots: 3% chance

When an AI bid fires, the increment is `randomInt(3, max(8, floor(currentBid * 0.08)))`. This means AI bids scale with the current price -- an 8% bump at most, with a floor of 3 credits.

If the player was winning a lot and the AI bid pushes the price above the player's bid, the lot gets an "outbid" flash for 1.5 seconds.

### What Makes the Market Feel Alive

**The outbid flash is excellent.** The visual jolt of a cell flashing red when you are outbid creates immediate emotional response. It is the single strongest piece of feedback in the current game. The `outbid-pulse` CSS animation on the left border reinforces this -- you can see at a glance which of your positions are in danger without reading any numbers.

**The weight system creates visual drama.** As lots accumulate bids and approach expiry, their BSP weight increases, making their grid cells grow. The formula in `tick()` is:

```typescript
l.weight = 0.8 + (1 - timeRatio) * 0.8 + activityBoost + hasYourBid;
if (l.timeRemaining < 15) l.weight += 0.5;
```

This means lots you have bid on are always larger (the `hasYourBid` +1.0 bonus), lots approaching expiry grow (the `timeRatio` term), and heavily-contested lots expand (the `activityBoost` term). The grid literally reshapes itself around the action. This is the game's strongest visual mechanic and the BSP algorithm handles it well.

**Spawning is steady.** New lots every 5 seconds (`LOT_SPAWN_INTERVAL = 5000`) with a cap of 30 active lots creates a constantly refreshing market. The player always has new opportunities appearing.

### Where the Market Falls Flat

**AI bidders are indistinguishable.** Every AI bid comes from the same probability distribution. There is no sense of competing against specific opponents. The player never thinks "that collector is going after Ambrose" or "someone is sniping my lot." The market feels like random noise rather than a populated exchange floor.

**AI bid timing is too uniform.** The 3-second interval with flat probability checks means AI bids arrive in a steady drizzle. Real auctions have tempo -- quiet stretches followed by bidding wars. The current system never creates a sense of multiple bidders fighting over a lot in rapid succession.

**No bid acceleration near expiry.** While the probability does jump to 20% in the last 10 seconds, this is still per-lot per-tick. With 30 active lots, the player sees AI bids scattered across the grid rather than concentrated on expiring lots. In a real auction, the final seconds are where the drama lives. Currently, lots often expire with no late competition at all.

**Starting bids are disconnected from relic value.** `randomInt(15, 150)` means a Class I signature relic (Heart of Teresa) can start at 15 credits while a Class III dust vial starts at 150. There is no price discovery to learn. The player cannot develop intuition about what things should cost because the game itself does not know.

### Proposals

**Proposal 1: Named AI bidders with behavioral profiles.** Create 4-6 AI bidder entities that persist throughout the session:

```typescript
interface AIBidder {
  name: string;          // "BORGIA", "MOTHER CAECILIA", "THE VENETIAN"
  targetSaint: string;   // which saint they're collecting
  aggression: number;    // 0.5-2.0 multiplier on bid probability
  budget: number;        // finite, depletes over time
  style: 'sniper' | 'steady' | 'panic';
}
```

- **Sniper** bidders wait until the last 15 seconds and then bid aggressively.
- **Steady** bidders place regular incremental bids throughout.
- **Panic** bidders overbid when they see competition (player bids trigger them).

Announce their activity in the terminal: `[MARKET] BORGIA bid on LOT-0042 — AMBROSE Rib Section VII`. Now the player can read the feed and learn who wants what.

**Proposal 2: Value-aware starting bids.** Replace the random starting bid with class-aware pricing:

```typescript
const classBase = { 1: 120, 2: 70, 3: 35 };
const startingBid = Math.floor(classBase[relicClass] * (0.4 + Math.random() * 0.5));
```

Class I relics start at 48-108. Class III relics start at 14-25. Now the player can learn: "Class I relics are always worth bidding on when they start below 60" or "That Class III at 45 is overpriced." Price discovery becomes a skill.

**Proposal 3: Bid clustering for drama.** When one AI bid fires on a lot, give a 40% chance that a second AI bid follows within 500ms. This creates the "bidding war" feeling -- two rapid-fire bids that visually register as competition. The current drizzle of one-bid-every-3-seconds never creates this sensation.

**Proposal 4: Completion-driven AI aggression.** Track AI collector progress toward saints. When an AI collector is within 2 relics of completing a saint, they bid 2-3x more aggressively on that saint's remaining relics. This creates the "rival collector" pressure that makes late-game bidding tense. Surface it in the terminal: `[ALERT] BORGIA at 10/12 AMBROSE — aggressive bidding expected`.

---

## 3. CORE GAME MECHANICS

### The Bid Flow

The current flow is: click lot in grid or ticker -> BidPanel opens -> choose quick bid (+10, +50, +100) or type custom amount -> bid placed instantly. The `placeBid` function validates that the amount exceeds the current bid and does not exceed the player's currency, then updates the lot state.

**What's satisfying:** Quick bid buttons are perfectly sized for rapid decisions. The auto-focus on the input field when selecting a lot (`setTimeout(() => inputRef.current?.focus(), 50)`) means keyboard-heavy players can type a number and hit Enter fast. The confirmation flash ("BID PLACED") provides instant feedback.

**What's frustrating:** The bid value auto-populates to `currentBid + 10` every time the current bid changes. If the player is watching a lot and the AI outbids them, the input field resets to the new price + 10. This means a player trying to type a custom bid can have their input yanked away mid-keystroke. The `useEffect` dependency on `lot?.currentBid` causes this -- it should only reset the bid value when the player selects a *different* lot, not when the same lot's price changes.

**What's confusing:** The +10/+50/+100 increments are absolute, not percentage-based. On a lot at 20 credits, +100 is an absurd overbid. On a lot at 400 credits, +10 is barely meaningful. The increments should scale with the current bid: perhaps +5%/+15%/+30%, with a minimum of +5 each.

**What's missing:** There is no way to see what you would pay relative to your remaining budget. If currency is 800 and the lot is at 350, the player must mentally calculate that bidding 400 would leave them with 400. A simple "after bid: 400 remaining" line in the BidPanel would remove this friction.

### The Lot Lifecycle

Lots are born with a random duration between 45 and 150 seconds (`randomInt(45, 150)`). They tick down at 1 second per tick. When `timeRemaining` hits 0, the lot resolves: if the player's bid is the current highest, they win; otherwise it closes or is lost. Won/lost/closed lots hang around for 2 more ticks (`timeRemaining > -2` check) before being filtered out.

**What's satisfying:** The 45-150 second range creates genuine variety. Some lots feel urgent (45s = barely enough time to notice and bid), others feel leisurely (150s = time to watch and snipe). The 2-second linger after resolution is just long enough to register the win/loss flash without cluttering the grid.

**What's frustrating:** The range is too wide. A 150-second lot is 2.5 minutes -- in a game where the entire market is churning, this lot just sits there taking up grid space for an eternity. Most players will bid on a 150-second lot early and then forget about it, which means the moment of resolution (win or outbid) happens long after they stopped paying attention. The late-stage outbid on a forgotten lot is the game's most annoying moment.

**What's missing:** There is no "closing" warning state. The lot jumps from `active` to resolution with no intermediate signal beyond the timer turning red at <30 seconds. A "CLOSING" status at <10 seconds with a distinct visual treatment (pulsing border, amber background) would create anticipation and give the player one last chance to raise their bid.

### The BSP Grid

The BSP algorithm in `bsp.ts` recursively splits the available space using weight-based ratios. Lots are sorted by weight descending, then partitioned at the 40% cumulative weight threshold. The split direction alternates between horizontal and vertical based on whether the available width exceeds the available height.

**What's satisfying:** The grid is beautiful. The 600ms CSS transition on position/size creates a fluid, organic-feeling layout that constantly breathes. Watching cells grow as lots heat up and shrink as they cool down is genuinely compelling. The `MIN_CELL_W = 120` and `MIN_CELL_H = 90` constraints prevent cells from becoming unreadably small.

**What's frustrating:** With 18-30 active lots (the normal operating range), many cells are at or near minimum size. At minimum size, the cell can only show the lot ID, a truncated relic name, the price, and the timer -- which is enough, but barely. The `isTiny` threshold (`w < 150 || h < 90`) hides the relic name entirely, which means tiny cells are essentially anonymous price/timer readouts. The player must click them to learn what they are.

**Proposal:** Reduce `INITIAL_LOTS` from 18 to 12 and `MAX_LOTS` from 30 to 20. Fewer lots means each cell gets more space, which means more information is visible at a glance. The market feels more curated and less overwhelming. To compensate for fewer lots, increase lot durations slightly and make each lot more meaningful (higher starting bids, more AI competition per lot).

### The Saint Completion Loop

The player collects relics by winning auctions. Won relics are immediately added to the saint's `collectedRelics` array and the bid price is deducted from currency. When all relics for a saint are collected, a `SaintCompleteOverlay` displays for 2.5 seconds.

**What's satisfying:** The SaintTracker bar with its `'█'.repeat(filled) + '░'.repeat(total - filled)` progress visualization is a perfectly tuned piece of information design. At a glance, the player can see how close each saint is to completion. The block characters fit the terminal aesthetic perfectly.

**What's frustrating:** There is no intermediate reward for partial progress. Going from 0/12 to 6/12 on Ambrose feels the same as going from 0/12 to 1/12. The only feedback is the progress bar inching forward. There should be milestone moments -- at 25%, 50%, 75% completion, something should happen. A terminal message, a sound, a brief visual flourish on the SaintTracker.

**What's confusing:** It is unclear whether collecting multiple relics from different saints is better or worse than focusing on one. The game provides no guidance on this strategic choice. The SaintTracker shows all 8 saints at once, which implicitly suggests you should be working on all of them -- but the math makes this impossible with 5000 credits. A subtle highlight on saints where the player has made progress (>2 relics) would help focus attention.

**What's missing:** The completion overlay is anticlimactic. 2.5 seconds of "SAINT COMPLETE / AMBROSE" in plain text, then it vanishes. This should be the game's biggest moment -- the payoff for potentially minutes of careful bidding. It needs a longer duration (4-5 seconds), a more dramatic visual (particle effects, golden border, the saint's relic images arranged in a mandala pattern), and a sound. The current overlay feels like a system notification, not a victory.

---

## 4. OPPORTUNITIES FOR FUN

### Moments That Create Genuine Excitement

**The snipe.** A lot is at 3 seconds remaining, nobody has bid, the price is low. You slam a bid in at the last second and win. This is the single most exciting moment in the game and it happens organically from the timer + bid mechanics. The problem is that it happens rarely because most lots have long timers and receive AI bids well before expiry.

**The outbid recovery.** You are outbid on a lot you care about. The cell flashes red. You immediately re-bid higher. The cell goes green. This micro-drama of loss-and-recovery in 2 seconds is deeply satisfying. It works because the feedback (red flash -> your higher bid -> green state) is immediate and visual.

**The heresy buy window.** You see the heresy fire, you recognize the opportunity, you bid on an uncontested lot. This is satisfying because it rewards attention and creates a "I know something the market doesn't" feeling, even though the "market" is just frozen AI.

**The wololo.** Discovering a hidden wololo monk in a grid cell and hearing the sound effect is a moment of pure delight. It is completely irrelevant to gameplay and that is why it works. It breaks the tension. The 5% spawn rate is perfect -- rare enough to be a surprise, common enough that most sessions will have one.

### Moments That Are Boring

**Mid-timer lots with no competition.** A lot at 60 seconds remaining with no bids and no AI interest is dead space. The player sees it, evaluates it, either bids or ignores it, and then waits. There is nothing to do with it for another 40+ seconds. These lots should either attract AI bids (to create competition) or have shorter durations (to create urgency).

**Watching the terminal feed when nothing is happening.** System messages like "> Market tick synchronized" and "> Bid encryption nominal" are atmospheric but not engaging. After the first 30 seconds, the player stops reading them. They are wallpaper. These messages should occasionally contain gameplay-relevant information -- hints about upcoming lots, market commentary, or saint-specific demand signals.

**The late game when currency is depleted.** Once the player has spent most of their 5000 credits, the game enters a passive watching phase. You have bids outstanding but no money to bid on new lots. You watch lots expire that you cannot afford. This is the game telling you it is over without actually ending. With the current spend-down model (no selling), this is an inherent structural problem.

### Small Changes, Outsized Impact

**1. Sound on outbid.** A short, sharp alert sound when the player is outbid on any lot. Currently the red flash is the only signal. Adding audio means the player does not need to be looking at the specific cell to know they are losing a position. This single addition would dramatically increase tension because the player would hear their positions being attacked even while focused elsewhere.

**2. Keyboard shortcuts for quick bids.** Let the player press 1/2/3 to place +10/+50/+100 bids on the selected lot without clicking. In a game about speed and attention, removing the mouse-to-button travel time is significant. Also: arrow keys to cycle through lots in the ticker, Enter to confirm a bid.

**3. "Hot lot" indicator.** When a lot receives 3+ bids in the last 15 seconds, mark it with a flame or heat icon. This tells the player "competition is happening here" without requiring them to watch bid counts. The BSP weight system already tracks this (bid count contributes to `activityBoost`), but it is not surfaced as a distinct visual signal.

**4. Lot expiry countdown sound.** A soft tick-tick-tick at 10 seconds remaining, increasing in speed, for any lot the player has bid on. This creates tension without requiring the player to watch the timer. The audio channel is almost entirely unused in the current game (only the wololo easter egg uses it) and represents a massive untapped feedback surface.

**5. "Your lot won" celebration micro-animation.** Currently a win shows a green flash for 2 seconds. Add a brief golden shimmer on the relic image in the Collection panel when a new relic is added. This connects the win (grid event) to the collection (sidebar state) and reinforces the "I am building something" feeling.

**6. Grid cell hover preview.** On hover (not click), show a tooltip with the relic name, saint name, class, and your bid status. This lets the player scan the grid without committing to a selection. Currently, clicking a cell is required to see full details in the BidPanel, which means every "just looking" action is also a "select for bidding" action. These should be separate.

---

## 5. FINE-TUNING PARAMETERS

### Current Parameters vs. Recommended

| Parameter | Current | Recommended | Rationale |
|-----------|---------|-------------|-----------|
| `STARTING_CURRENCY` | 5000 | 3000 | 5000 is too comfortable. The player never feels pressure until very late. 3000 forces earlier prioritization of which saints to pursue without being punishingly tight. |
| `INITIAL_LOTS` | 18 | 12 | 18 lots on a 1080p screen means most cells are cramped. 12 lots gives each cell 50% more area, making relic names and saint info readable without clicking. |
| `MAX_LOTS` | 30 | 20 | 30 active lots is overwhelming. The player cannot track that many simultaneous auctions. 20 is still a busy market but scannable in 3-4 seconds. |
| `LOT_SPAWN_INTERVAL` | 5000ms | 7000ms | With fewer max lots, spawn slightly slower to maintain the same "lots per minute" feel while giving each lot more individual attention. |
| `TICK_INTERVAL` | 1000ms | 1000ms | No change. 1-second ticks are the right granularity. |
| `AI_BID_INTERVAL` | 3000ms | 2000ms | Faster AI bid checks, but with lower per-lot probability (see below), creates more natural-feeling bid distribution. |
| AI bid chance (>30s remaining) | 0.03 | 0.015 | Half the per-check probability at double the frequency nets roughly the same number of bids but distributes them more evenly, reducing long dry spells. |
| AI bid chance (10-30s remaining) | 0.08 | 0.06 | Slight reduction to compensate for higher check frequency. |
| AI bid chance (<10s remaining) | 0.20 | 0.25 | Increase late-game AI aggression. The last 10 seconds should feel contested. |
| Lot duration range | 45-150s | 30-90s | Tighten the range. 150s lots are boring. 30s lots create urgency. 90s is long enough for a contested bidding war without overstaying. |
| Starting bid range | 15-150 | Class-based (see above) | Random starting bids with no relation to relic value prevent price discovery. Class-based pricing creates a learnable market. |
| `HERESY_CHANCE` | 0.35 | 0.15 | Less frequent, more impactful. Each heresy should feel like an event, not background noise. |
| `FEED_INTERVAL` | 2500ms | 3000ms | Slightly slower feed gives each message more time on screen. At 2500ms, messages scroll past too quickly to read. |
| `HERESY_SLOWDOWN_MS` | 4000ms | 6000-10000ms (varies by sect) | Longer freeze windows give the player time to actually exploit the opportunity. Sect-dependent duration adds variety and learnable patterns. |
| Flash duration (outbid) | 1500ms | 2000ms | The outbid flash is the game's most important feedback signal. Give it slightly more screen time so the player is less likely to miss it. |
| Flash duration (win) | 2000ms | 3000ms | Wins deserve more celebration. 2 seconds is barely enough to register. |
| Saint complete overlay | 2500ms | 5000ms | This is the game's biggest moment. Let it breathe. |
| Weight bonus for player bid | 1.0 | 1.5 | Lots the player cares about should be even more prominent. The extra 0.5 weight makes "your" lots clearly larger than similar uncontested lots, improving at-a-glance scannability. |
| Weight bonus for <15s remaining | 0.5 | 0.8 | Expiring lots should be visually urgent. A bigger weight bump makes them grow noticeably in the last 15 seconds, creating a "this is ending" visual signal independent of the timer color change. |

### New Parameters to Add

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `AI_BID_CLUSTER_CHANCE` | 0.4 | After one AI bid on a lot, 40% chance of a second bid within 500ms. Creates bidding war feel. |
| `HERESY_TELEGRAPH_MS` | 3500 | Time between heresy warning and heresy activation. Gives player preparation time. |
| `COMPLETION_MILESTONE_THRESHOLDS` | [0.25, 0.5, 0.75] | Fractions of saint completion that trigger milestone feedback (terminal message + brief visual). |
| `LOT_CLOSING_THRESHOLD` | 10 | Seconds remaining before a lot enters "CLOSING" visual state with distinct treatment. |
| `MIN_LOT_FOR_AI_INTEREST` | 25 | Seconds remaining before which AI bids are suppressed. Keeps early lot life quiet, concentrates action in the back half. Overridden by high-value lots (Class I relics always attract AI interest). |
| `DEMAND_EVENT_INTERVAL` | 30000-60000ms | How often a saint-specific demand surge fires (for future market dynamics). Announced in terminal 10s before activation. |

### The Pacing Curve

The current game has flat pacing -- the same spawn rate, AI aggression, and heresy frequency from start to finish. This should change:

**Minutes 0-3 (Opening):** Slower spawn rate (9000ms), low AI aggression (halve all bid probabilities), no heresies. The player learns the grid, places first bids, gets comfortable. 12 lots on screen.

**Minutes 3-8 (Building):** Normal parameters kick in. Heresy events begin. AI bidders become competitive. Lots at full spawn rate. The player is actively trading and building toward saints.

**Minutes 8-15 (Intensifying):** AI aggression increases by 50%. Heresy events become more frequent (HERESY_CHANCE = 0.20). Max lots increases to 24. New lots have shorter durations (30-60s instead of 30-90s). The market is heating up.

**Minutes 15+ (Endgame):** If the game runs this long, AI is highly aggressive. Multiple heresies can overlap. Lot durations are short (20-50s). The grid is churning fast. The player is either completing saints or scrambling to catch up. This is where the game should feel like a climax, not a slog.

This escalation curve means the first session minute feels welcoming and the fifteenth feels frantic, which mirrors the emotional arc of a good trading day: calm open, busy midday, frantic close.

---

## APPENDIX: PRIORITY RANKING

If only five changes could be made, these would have the most impact on fun:

1. **Reduce lot count (18->12 initial, 30->20 max) and tighten duration range (30-90s).** This single change makes every lot more readable, more contested, and more urgent. It is the highest-leverage parameter change available.

2. **Differentiate heresy sects mechanically.** Give each sect a distinct effect on specific saints. This transforms the terminal feed from decoration into the game's primary skill surface.

3. **Add sound: outbid alert, countdown tick, win chime.** The audio channel is almost completely unused. Three sounds would double the game's feedback density without adding any visual clutter.

4. **Scale bid increments to current price.** Replace +10/+50/+100 with percentage-based increments. This removes the "overbid on cheap lots, underbid on expensive lots" problem and makes the bid buttons useful across the entire price range.

5. **Fix the BidPanel input reset bug.** The bid value resetting on every price change (because `useEffect` depends on `lot?.currentBid`) is a real usability problem that punishes engaged players. Change the dependency to only reset on `lot?.id` change.

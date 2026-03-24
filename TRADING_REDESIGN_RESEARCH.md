# HOLY_OPS.EXE — Trading Redesign Research Report

## The Central Question

HOLY_OPS.EXE has strong bones: the BSP treemap grid is visually distinctive, the heresy system creates natural tempo breaks, the terminal aesthetic sells the fiction of operating a clandestine relic exchange, and the real-time pacing creates urgency. The question is how to transform a spend-down auction game (fixed budget, bid until broke) into a buy-low-sell-high trading game where the player accumulates capital through market literacy.

This report covers genre analysis, core loop redesign, and a concrete design proposal.

---

## 1. Genre Analysis: Trading Games That Work

### What Makes the Good Ones Good

**Recettear** (2007/2010) succeeds because it splits its loop into two halves that feed each other: dungeon crawling produces inventory, and shopkeeping converts inventory into profit. The shopkeeping half works because customers have visible mood states, price sensitivity varies by character, and the player learns over time that the old man will overpay for books but the little girl won't. The core skill is *reading the customer*, not doing arithmetic. The debt payment schedule creates escalating pressure that prevents the game from becoming a relaxed optimization puzzle.

**Moonlighter** (2018) uses a similar split but makes price discovery the explicit mechanic. You set a price, watch the customer's face, and adjust. Too high: they grimace and leave. Too low: they grab it with hearts in their eyes and you know you left money on the table. The feedback is immediate, visual, and slightly painful when you get it wrong. The key insight is that *losing potential profit feels almost as bad as losing actual money*, and the game exploits this constantly.

**Offworld Trading Company** (2016) is the purest real-time market manipulation game. Prices respond to supply and demand in real time. The core skill is reading the market ticker and anticipating where prices are going based on what your opponents are building. Buying resources before your opponent needs them (and before demand spikes the price) is the entire game. It proves that a market ticker can be the primary gameplay surface — you don't need a shop interface. It also proves that real-time markets create their own drama: you see the price climbing, you know you need to buy NOW, but you're not sure if it's peaking or still climbing.

**EVE Online's** economy works because information is scarce, logistics are costly, and regional price differences create arbitrage opportunities. A player who knows that Jita sells Tritanium at 4.5 ISK and Hek buys it at 5.2 ISK has an exploitable edge — but only if they can move the goods and only if the spread persists. The lesson: spatial or temporal price differences create the *raw material* of trading gameplay. The player's job is to spot and exploit them before they close.

**Merchant of the Skies** (2020) demonstrates that trading works even in a relaxed, low-stakes context, as long as the player feels clever for finding routes. Buy tea cheap in one town, sell it expensive in another. The satisfaction comes from *the spread*, not the absolute numbers. It also shows a common failure mode: once you find the optimal route, the game becomes mechanical.

### Proven Design Patterns

1. **Price discovery as skill.** The player must learn what things are worth. The game never tells them directly. They infer it from signals.
2. **Information asymmetry.** The player knows something the market doesn't (or vice versa). This creates the "aha" moment.
3. **Opportunity cost tension.** Every purchase forecloses other purchases. Every sale means giving up future potential. The interesting decisions are about *when*, not just *what*.
4. **Escalating stakes.** Early trades are small and safe. Late trades are large and risky. The player's portfolio grows, and so does what they stand to lose.
5. **Visible market dynamics.** The player can see prices moving and infer causes. The market is not a black box — it's a system they learn to read.
6. **Time pressure without panic.** The best trading games create urgency without requiring twitch reflexes. The pressure is cognitive, not mechanical.

### Common Failure Modes

1. **Solved routes.** If the optimal strategy is always "buy X here, sell X there," the game dies after the player figures it out.
2. **Spreadsheet creep.** If the player needs to track too many numbers mentally, the game stops being fun and starts being work.
3. **Meaningless abundance.** If money accumulates faster than it can be spent, trading becomes pointless. The game needs money sinks.
4. **Random walk masquerading as skill.** If prices are purely random, the player can never develop expertise. They need learnable patterns.
5. **Analysis paralysis.** Too many options with no clear framework for evaluating them freezes the player.

---

## 2. The Core Loop Redesign

### Current Loop (Spend-Down)

```
Lots spawn -> Scan grid -> Pick lot -> Bid against AI -> Win/Lose -> Collect relic
                                                                          |
Currency depletes linearly -----------------------------------------> Game over
```

This loop has one dominant resource (currency) flowing in one direction (down). There's no recovery, no growth, no compounding. The player's power decreases every turn.

### Proposed Loop (Trading)

```
SCAN MARKET -> IDENTIFY OPPORTUNITY -> BUY (or SELL) -> HOLD / FLIP -> PROFIT
     |                                                                    |
     v                                                                    v
 Observe prices, trends,              Reinvest in more trades, or lock
 heresy signals, saint demand         relics into collection (permanent,
                                      cannot be sold)
```

The critical structural change: **relics are tradeable assets, not just collectibles.** When you win a relic at auction, it enters your *portfolio*, not your *collection*. From your portfolio, you can either:
- **SELL** it back to the market at current market price (profit or loss)
- **ENSHRINE** it (lock it permanently into your saint collection — it can never be sold)

This creates the core tension: every relic in your portfolio is liquid capital. Every relic you enshrine is permanent progress toward your win condition but represents capital you can never recover.

### What a "Turn" Feels Like

Even though the game is real-time, the player's cognitive loop has a natural rhythm:

1. **SCAN** (2-5 seconds): Eyes sweep the grid and ticker. What's cheap? What's about to expire? Which saints are trending?
2. **EVALUATE** (1-3 seconds): Is this relic underpriced relative to its saint's demand? Can I flip it? Or do I need it for my collection?
3. **ACT** (instant): Place bid, or sell from portfolio, or pass.
4. **WAIT** (5-30 seconds): Watch your positions. Did the AI outbid you? Is the price moving the way you predicted?
5. **RESOLVE** (instant): Win or lose the auction. Book the profit or loss on a sale.

Each cycle takes 10-40 seconds. A session is 30-60 of these cycles. The game wants to be playable in 15-25 minute sessions.

---

## 3. Information Asymmetry as Gameplay

The best trading games give the player information edges they can learn to exploit. Here's how HOLY_OPS.EXE creates them:

### Edge 1: Saint Demand Forecasting

**The mechanic:** The terminal feed doesn't just display heresy flavor text. It leaks upcoming *demand events*. Every 30-60 seconds, the system broadcasts a "PAPAL DECREE" or "PILGRIMAGE NOTICE" that will cause a specific saint's relics to surge in price 15-20 seconds later.

Example feed messages:
```
[DECREE] Papal delegation requests AMBROSE relics for veneration
[PILGRIMAGE] Faithful converge on Venice — LUCIA demand surging
[EDICT] TERESA canonization anniversary — prices expected to rise
```

**The skill:** The player who reads the terminal feed knows a price surge is coming before it hits. They can buy AMBROSE relics at current prices and sell (or hold) when demand spikes. The player who ignores the feed is trading blind.

**Why it works:** The information is available to everyone (it's right there in the terminal), but it requires *attention*. The player is already juggling active bids, portfolio management, and grid scanning. The terminal is a resource that rewards focused attention in a game of divided attention.

### Edge 2: Heresy-Driven Price Disruption

**The mechanic:** Heresy events already freeze AI bidding for 4 seconds. In the trading game, heresy events also *temporarily depress prices* for the sect's associated saint. Each sect has an affinity to 1-2 saints:

| Sect | Affected Saints | Effect |
|------|----------------|--------|
| FLAGELLANTS | SEBASTIAN, FRANCIS | Prices drop 15-25% during tribunal |
| CATHARI | CATHERINE, TERESA | Prices drop 15-25% during tribunal |
| GNOSTIC ORDER | BARTHOLOMEW | Prices drop 20-30% during tribunal |
| BOGOMILS | AMBROSE, AGATHA | Prices drop 15-25% during tribunal |
| WALDENSIANS | LUCIA, FRANCIS | Prices drop 15-25% during tribunal |

**The skill:** When a FLAGELLANT heresy fires, the player knows SEBASTIAN relics are temporarily cheap *and* that AI bidders are frozen. This is a double opportunity: buy at depressed prices with no competition. But the window is only 4 seconds.

**Why it works:** It rewards the player for internalizing the sect-saint mapping. Early in the game, they might not notice. By mid-game, they're watching for specific sect names and reacting instantly. This is learnable pattern recognition, the same skill that makes card games like Slay the Spire work.

### Edge 3: Relic Class Arbitrage

**The mechanic:** Class I relics (body parts) are inherently more valuable than Class II (possessions) or Class III (touched objects). But the auction starting prices don't fully reflect this. A Class I relic might start at 40 credits while a Class III starts at 120 credits — a mispricing the informed player can exploit.

**The skill:** The player learns to evaluate relics by class, not just by sticker price. A "cheap" Class I relic is a buy. An "expensive" Class III relic is a pass (or a short sell target if you're feeling aggressive).

### Edge 4: Completion Premium

**The mechanic:** As a saint approaches completion (7/8, 9/10, etc.), their remaining relics become exponentially more valuable because *someone* (player or AI) needs them to finish. The second-to-last and last relics for any saint command massive premiums.

**The skill:** If you notice that TERESA is at 6/8 collected across all players, and you own one of the remaining two relics, you're holding a scarce asset. You can sell it at a premium or enshrine it to complete your own TERESA collection.

---

## 4. The Tension Between Trading and Collecting

This is the most interesting design space in the game. Here's the formal structure of the dilemma:

### The Enshrine Decision

When you hold a relic, you face a choice:
- **SELL:** Convert it back to credits. You're liquid. You can trade more. But you've given up a piece of a saint you might need.
- **ENSHRINE:** Lock it into your collection permanently. It counts toward saint completion (your win condition). But you can never get those credits back, and you've reduced your trading capital.

### Why This Works

Consider this scenario: You've enshrined 5/8 TERESA relics. The 6th appears on the market at 200 credits. Your trading capital is 350 credits. If you buy and enshrine it, you're down to 150 credits — barely enough to trade with. If you pass, someone else might buy it, and the next time it appears, it might cost 400.

This is not a math problem. It's a *judgment call* about how much liquidity you're willing to sacrifice for progress. Every enshrine makes you poorer in the short term and closer to winning in the long term. The pacing of these decisions determines the game's emotional arc:

- **Early game:** Enshrine rarely. Trade aggressively. Build capital.
- **Mid game:** Start enshrining strategically. Target one saint. Accept the capital hit.
- **Late game:** You're committed. You need specific relics. You'll pay whatever it takes.

### Design Rule: Enshrining Should Feel Expensive

The enshrine action must feel like a sacrifice. Visual language: the relic moves from your portfolio (liquid, bright, tradeable) into a stone reliquary (permanent, dim, locked). A locking sound. The portfolio value drops visibly. The saint progress ticks up. It should feel like placing a brick in a cathedral — permanent, deliberate, costly.

### Design Rule: Selling Should Feel Guilty

When you sell a relic that belongs to a saint you're collecting, the game should surface this. "SELLING TERESA relic. TERESA: 3/8." A brief hesitation beat in the UI. Not a confirmation dialog — that would be patronizing — but a visual reminder of what you're giving up.

---

## 5. Pacing and Rhythm

### The Case Against Pure Real-Time

The current game is purely real-time (1s ticks, 5s spawns). For an auction game, this works — urgency is the entire experience. For a trading game, pure real-time has a problem: the player needs time to *think*. Trading is about analysis, not reflexes. If prices change every second and lots expire constantly, the player can never step back and evaluate their position.

### The Case Against Pure Turn-Based

But pure turn-based kills the energy. The BSP grid's visual dynamism, the heresy events' surprise, the feeling of a live market — these all depend on real-time flow. A turn-based relic trading game is a different (and much less interesting) game.

### The Proposed Hybrid: Market Phases

Structure each game session around **market phases** that create natural rhythms:

**PHASE 1: PRE-MARKET (30 seconds)**
- The board populates with the day's lots. Prices are visible but bidding is locked.
- The terminal feed shows the day's decrees and rumors.
- The player can plan: what do I want to buy? What should I sell?
- This is the "study the board" phase. Low stress, high analysis.

**PHASE 2: OPEN MARKET (3-4 minutes)**
- Bidding is live. AI bidders are active. Lots expire. New lots spawn.
- This is the current game's energy — real-time, competitive, urgent.
- Heresy events fire and create freeze windows.
- Prices move in response to demand (see Market Simulation below).

**PHASE 3: CLOSING BELL (30 seconds)**
- No new lots spawn. Remaining lots accelerate their timers (2x speed).
- AI bidding becomes more aggressive.
- The player must decide: bid hard on remaining lots or preserve capital?
- This creates a natural "last call" urgency.

**PHASE 4: PORTFOLIO MANAGEMENT (no time limit)**
- The market is closed. The board is empty.
- The player reviews their portfolio: what did they buy? What's it worth now?
- Enshrine decisions happen here, when the player has time to think.
- Sell orders can be queued for the next market open.
- The terminal shows a "market summary" with price changes and trends.

Then the cycle repeats. Each full cycle is one "day" in the game. A session is 5-8 days. Total playtime: 20-35 minutes.

### Why Phases Work

Phases solve the real-time-vs-analysis tension by separating them. The market phase is fast and exciting. The portfolio phase is slow and strategic. The player gets both experiences in every session. This is the same structure that makes Slay the Spire work: combat is real-time-ish (cards have urgency), but deck management between fights is contemplative.

Phases also create narrative arcs within each day. "I knew LUCIA was going to spike, I loaded up in pre-market, and I sold at the closing bell for 40% profit." That's a *story*, not just a series of button clicks.

---

## 6. Difficulty Curve and Progression

### Early Game (Days 1-3): Learning the Market

- Starting capital: 500 credits (deliberately small — forces small trades)
- Only 3-4 saints' relics appear on the market
- AI bidders are passive (low aggression, slow reaction)
- Heresy events are rare but clearly telegraphed
- Price swings are gentle (5-15%)
- **Player goal:** Learn to read the grid, make a few profitable trades, build capital to 800-1000

### Mid Game (Days 4-8): Exploiting the System

- Capital is 800-2000 credits (depending on skill)
- All 8 saints are active
- AI bidders are moderate (will compete for valuable lots)
- Heresy events are frequent and create real opportunities
- Price swings are meaningful (10-30%)
- Demand events start appearing in the terminal feed
- **Player goal:** Identify a target saint, start enshrining, exploit heresy windows for profit

### Late Game (Days 9-15): The Collection Push

- Capital should be 2000-5000+ credits if trading well
- AI bidders are aggressive and will specifically compete for completion relics
- "Rival collectors" appear — AI entities that are also trying to complete saints and will bid astronomically for the last few pieces
- Heresy events can be catastrophic (market crashes that wipe 30-40% of portfolio value)
- **Player goal:** Complete 2-3 saints while maintaining enough capital to keep trading

### What Prevents Triviality

The key anti-triviality mechanic is **AI collectors who also want to complete saints.** If you're at 7/8 TERESA, there's an AI collector also at 6/8 TERESA. When the 7th TERESA relic appears, you're both bidding. This creates genuine scarcity pressure that scales with your progress.

Additionally, **inflation.** Prices drift upward over the course of a game session. A relic that cost 80 credits on Day 1 costs 150 credits on Day 10. This means hoarding cash is punished — you need to be invested in relics to keep up with inflation. (This is the same anti-turtling mechanic that Offworld Trading Company uses.)

---

## 7. The Role of Randomness vs. Skill

### The Framework: Randomness in Inputs, Skill in Responses

The game should be random in *what appears* but skillful in *how you respond*:

**Random inputs (the player cannot control):**
- Which relics appear on the market
- Starting prices of lots
- When heresy events fire and which sect triggers them
- AI bidder behavior variance (some days they're aggressive, some passive)
- Demand events (which saint surges)

**Skill-based responses (the player learns and improves):**
- Recognizing underpriced relics (pattern recognition)
- Exploiting heresy windows (timing and attention)
- Reading demand signals in the terminal (information processing)
- Portfolio management and enshrine timing (strategic planning)
- Bid sizing (risk management — don't overbid, don't underbid)

### The Slay the Spire Principle

Slay the Spire's design philosophy applies directly: each individual run has significant variance, but over many runs, skilled players consistently outperform. The randomness is in the card offerings and enemy encounters. The skill is in evaluating those offerings and adapting strategy.

In HOLY_OPS.EXE, the randomness is in the market. The skill is in reading it. A skilled player should win 70-80% of sessions on normal difficulty. An unskilled player should win 20-30%. The gap should be wide enough to feel meaningful but not so wide that randomness feels irrelevant.

### Ensuring Skill Expression

Three concrete mechanisms:

1. **Learnable price patterns.** Relic classes have predictable value ranges. Class I relics trend toward 200-400 credits. Class III relics trend toward 50-120 credits. A player who knows this can instantly spot mispriced lots.

2. **Predictable heresy effects.** The sect-saint mapping is fixed. Once learned, the player can predict which relics will be cheapest during a heresy event.

3. **Terminal feed as a skill test.** The terminal scrolls continuously. The player who reads it gains information. The player who ignores it doesn't. This is a pure attention-allocation skill.

---

## 8. Failure States and Rubber-Banding

### The Current Problem

The current game has a hard failure state: you spend all your money and can't bid anymore. There's no recovery. This is fine for a short arcade experience but wrong for a trading game, where a bad streak should be recoverable.

### Proposed Failure Recovery Mechanics

**Mechanism 1: Minimum Stipend**
If your total net worth (cash + portfolio value) drops below 100 credits, you receive a "PAPAL SUBSIDY" of 50 credits at the start of each market phase. This prevents the player from being completely locked out. The stipend is small enough that it doesn't reward failure, but large enough that a skilled player can trade their way back.

**Mechanism 2: Forced Liquidation Instead of Bankruptcy**
If you can't afford to bid on anything, the game doesn't end. You still have your portfolio. You can sell relics to generate capital. The worst case is that you have to sell enshrined relics (breaking your saint progress) — which is painful but not game-ending. This should be framed as "DE-SANCTIFICATION" in the fiction: the Vatican is reclaiming relics to cover your debts.

**Mechanism 3: Market Corrections**
If the player's portfolio value drops more than 40% in a single day (due to a market crash or bad trades), the next day's market opens with depressed prices across the board — effectively a "sale" that gives the player more buying opportunities. This is rubber-banding that's diegetic (it's a market correction, not a handout) and skill-gated (you still have to make good trades with the cheap prices).

### What Failure Looks Like

The game should never say "GAME OVER." Instead, failure is *running out of time*. The game has a fixed number of days (12-15). If you haven't completed enough saints by the end, you lose. But even a player who's struggling financially can potentially recover with a good late-game run. The clock is the real antagonist, not bankruptcy.

---

## 9. UI/UX for Trading Gameplay

### What the Player Needs On Screen

The existing 3-column layout maps surprisingly well to a trading game:

**Left Column (Ticker) -> PORTFOLIO + ORDER BOOK**
- Top section: "YOUR PORTFOLIO" — relics you own, with current market value and P&L (profit/loss) for each
- Color coding: green if current value > purchase price, red if below
- Enshrine button next to each relic
- Bottom section: "MARKET ORDERS" — active lots you're bidding on (same as current "YOUR BIDS")

**Center (BSP Grid) -> THE MARKET**
- Identical to current grid, but lot cells now show:
  - Current price (not just "current bid")
  - Price trend arrow (up/down/stable over last 30 seconds)
  - Relic class badge (I/II/III)
  - "DEMAND" indicator if a demand event is active for this saint
- Cells for relics in the player's target saint could have a subtle highlight

**Right Column -> TRADE PANEL + INTELLIGENCE**
- Top: Trade panel (expanded from current BidPanel)
  - BUY (bid on lot) / SELL (from portfolio) toggle
  - Price chart: mini sparkline showing this relic type's price history
  - "Fair value" estimate based on relic class and saint demand (the game helps the player learn)
- Middle: Terminal feed (same as current, but with demand events mixed in)
- Bottom: Saint progress tracker (expanded from Collection, showing which relics you've enshrined)

### The Single Most Important UI Element

A **net worth ticker** in the title bar that updates in real time:

```
HOLY_OPS.EXE — ◈ 1,247 cash + ◈ 2,850 portfolio = ◈ 4,097 net worth
```

This gives the player a constant read on their financial health. It replaces the current simple currency display with a richer picture. When net worth goes up, it flashes green. When it drops, it flashes red. The player should *feel* their wealth fluctuating.

### Avoiding Spreadsheet Creep

The danger with all these numbers is overwhelming a player who didn't sign up for a finance simulator. Three rules:

1. **Color is information.** Green means good, red means bad, gold means opportunity. The player should be able to read the market by color without parsing numbers.

2. **Progressive disclosure.** The basic grid cell shows: relic name, price, trend arrow. Selecting a cell expands the detail panel with price history, fair value, and relic class. The player only sees complex information when they ask for it.

3. **The terminal tells stories, not data.** Instead of "LUCIA demand +23%," the terminal says "[PILGRIMAGE] Faithful converge on Venice — LUCIA relics in demand." The player infers the data from the narrative. This preserves the medieval fiction and avoids Bloomberg-terminal alienation.

### How the BSP Grid Evolves

The BSP grid is already the game's visual signature. For the trading game, the weight calculation changes:

```
weight = base_weight
       + demand_boost (if saint has active demand event)
       + price_momentum (if price is rising rapidly)
       + player_interest (if player has bid or owns this saint's relics)
       + urgency_boost (if lot is expiring)
```

This means: lots the player cares about and lots that are "hot" grow larger. Lots that are uninteresting shrink. The grid becomes a visual heat map of market activity, which is both useful (you can see where the action is) and beautiful (the grid is constantly reshaping itself in response to market dynamics).

---

## 10. Concrete Game Design Proposal

### Title
HOLY_OPS.EXE — Relic Exchange Terminal v0.2 (internal: "The Market Update")

### One-Sentence Pitch
You are a relic broker in a clandestine underground exchange, buying and selling sacred bones to accumulate enough wealth and inventory to complete saint collections before the market closes.

### Session Structure

A game session consists of **12 Market Days**. Each day has 4 phases:

| Phase | Duration | Activity |
|-------|----------|----------|
| BRIEFING | 15s | Terminal shows the day's decrees, rumors, and heresy warnings. Board populates. No bidding. |
| OPEN MARKET | 180s (3 min) | Live trading. Lots spawn, expire, and are bid on. Heresy events fire. |
| CLOSING BELL | 30s | No new lots. Remaining lots accelerate. Last-chance bidding. |
| SETTLEMENT | No time limit | Review portfolio. Enshrine relics. Queue sell orders. View market summary. Player clicks "NEXT DAY" to proceed. |

**Total session time:** 12 days x ~4.5 minutes = ~55 minutes maximum. Most sessions will be 25-35 minutes because experienced players move through Settlement quickly.

### Core Mechanics

**1. BUYING (at auction)**
Same as current game: bid on lots in the BSP grid. Win the lot, the relic enters your portfolio. You pay the winning bid price.

**2. SELLING (from portfolio)**
During any market phase, you can sell a relic from your portfolio. The sale price is determined by the **current market value** of that relic type, which fluctuates based on:
- Base value (determined by relic class: I > II > III)
- Saint demand multiplier (driven by demand events and completion scarcity)
- Heresy discount (if a relevant heresy event is active)
- Random noise (+/- 10%)

The sell is instant (no auction needed — you're selling to the market, not to a specific buyer). This keeps the sell-side simple while the buy-side (auction) remains competitive.

**3. ENSHRINING (from portfolio)**
During Settlement, you can enshrine relics into your saint collection. An enshrined relic is permanent: it counts toward saint completion and can never be sold. The UI shows enshrined relics as locked, dimmed, with a reliquary frame.

**4. MARKET PRICES**
Each relic type has a "market price" that updates every tick:

```
marketPrice = baseValue * saintDemandMultiplier * heresyModifier * (1 + noise)

where:
  baseValue = { classI: 200, classII: 100, classIII: 60 }
  saintDemandMultiplier = 1.0 (normal) | 1.3-1.8 (demand event) | 0.7-0.85 (heresy depression)
  noise = random(-0.10, +0.10), rerolled every 5 ticks
```

Lot starting bids are set at 40-70% of the current market price, creating a built-in margin for the player who wins at or near the starting bid.

**5. DEMAND EVENTS**
Every 20-40 seconds during the market phase, a demand event fires:
- Announced in the terminal feed 10-15 seconds before taking effect
- Lasts 30-60 seconds
- Increases the saintDemandMultiplier for one saint by 1.3-1.8x
- AI bidders become more aggressive for that saint's relics
- Grid cells for affected relics gain a "DEMAND" badge and pulse gold

**6. AI COLLECTORS**
2-3 AI collector entities exist in each game. Each one targets a specific saint and gradually accumulates relics toward completion. The player can see AI collector progress in the terminal:

```
[INTEL] Rival collector MARCHETTI at 5/10 LUCIA
[INTEL] Rival collector BORGIA at 8/12 AMBROSE — NEAR COMPLETION
```

AI collectors bid aggressively on relics they need, especially as they approach completion. This creates real scarcity pressure — if BORGIA is at 11/12 AMBROSE, the last AMBROSE relic will be astronomically expensive.

**7. HERESY EVENTS (evolved)**
Same as current: 35% chance per feed tick, 4-second AI freeze. New addition: heresy events depress prices for the associated saint's relics during the freeze window. This creates a buy window — cheap prices + no competition.

### Win Condition

At the end of Day 12, your score is calculated:

```
SCORE = (completed saints * 1000) + (enshrined relics * 50) + (net worth * 0.1)
```

Completing a saint is worth far more than anything else. Net worth is a tiebreaker. The game grades you:

| Grade | Requirement |
|-------|-------------|
| S — SANCTIFIED | 3+ saints completed |
| A — BLESSED | 2 saints completed |
| B — FAITHFUL | 1 saint completed |
| C — PIOUS | 6+ relics enshrined, 0 saints completed |
| D — NOVICE | Fewer than 6 relics enshrined |
| F — EXCOMMUNICATED | Net worth below starting capital |

### Starting Conditions

- Starting cash: 500 credits
- Starting portfolio: 1 random Class III relic (worth ~60 credits, gives the player something to sell immediately if they want)
- Day 1 market: Only 4 saints active, gentle prices, passive AI
- Tutorial prompts during Day 1's BRIEFING phase

### Difficulty Scaling by Day

| Day | Saints Active | AI Aggression | Price Volatility | Heresy Frequency | Special |
|-----|--------------|---------------|------------------|------------------|---------|
| 1-3 | 4 | Low | Low (5-15%) | Low | Tutorial hints in terminal |
| 4-6 | 6 | Medium | Medium (10-25%) | Medium | AI collectors appear |
| 7-9 | 8 | High | High (15-35%) | High | Rival completion pressure |
| 10-12 | 8 | Very High | Very High (20-40%) | Very High | Market crashes possible |

### Key Design Principles

1. **Every relic is a decision, not a collectible.** Buying a relic is the easy part. Deciding what to do with it is the game.

2. **The terminal is not decoration.** The terminal feed contains actionable intelligence. Players who read it trade better. This is the game's primary skill differentiator.

3. **The BSP grid is a visual market.** Large cells = hot markets. Small cells = cold markets. The grid's shape tells a story the player can learn to read.

4. **Time is the real currency.** You have 12 days. Every day you spend trading instead of enshrining is a day you're not completing saints. Every day you enshrine too early is a day you're trading with less capital. The tension between these two is the entire game.

5. **Failure is a slow bleed, not a cliff.** The player can always sell, always trade, always recover. But the clock is ticking. The question isn't "can I survive?" but "can I win in time?"

6. **The aesthetic serves the gameplay.** The Bloomberg-terminal-meets-medieval-reliquary aesthetic isn't just a skin. It sells the fiction that the player is operating a real exchange. The monospace fonts, the scrolling feed, the grid of shifting cells — these communicate "you are a trader" more effectively than any tutorial.

### What Changes in the Codebase

**New in `types.ts`:**
- `Portfolio` interface (relics the player owns but hasn't enshrined)
- `MarketPrice` interface (current price per relic type)
- `DemandEvent` interface
- `AICollector` interface
- `GamePhase` enum (BRIEFING, OPEN_MARKET, CLOSING_BELL, SETTLEMENT)
- `DayState` tracking current day number and phase

**New in `engine.ts`:**
- `sellRelic()` — sell from portfolio at market price
- `enshrineRelic()` — lock relic into saint collection
- `updateMarketPrices()` — tick-level price recalculation
- `fireDemandEvent()` — trigger and resolve demand surges
- `aiCollectorBid()` — AI collectors competing for specific relics
- `advancePhase()` — phase state machine
- `calculateScore()` — end-of-game scoring

**Modified:**
- `placeBid()` — won relics go to portfolio, not directly to saint collection
- `tick()` — respects phase state (no ticks during BRIEFING/SETTLEMENT)
- `aiBids()` — AI aggression varies by day and demand events
- `createLot()` — starting bids based on market price, not random

**New components:**
- `PortfolioPanel` — replaces part of LotTicker, shows owned relics with P&L
- `TradePanel` — expanded BidPanel with sell functionality and price chart
- `MarketSummary` — shown during SETTLEMENT phase, recaps the day's trades
- `PhaseIndicator` — shows current phase and countdown in title bar
- `ScoreScreen` — end-of-game grading

**Modified components:**
- `GridCell` — adds price trend arrows, demand badges, relic class indicators
- `TerminalFeed` — handles demand event messages and AI collector intel
- `SaintTracker` — shows enshrined (locked) vs portfolio (tradeable) relics separately
- `Collection` — becomes the enshrine interface during SETTLEMENT

### The Feel

The game should feel like you're operating a clandestine relic exchange out of a medieval monastery's basement, using a retrofuturistic terminal that hums and flickers. Each market day is a compressed Wall Street trading day. The BRIEFING is your morning coffee with the newspaper. The OPEN MARKET is the floor of the exchange — loud, fast, competitive. The CLOSING BELL is the scramble to close positions. The SETTLEMENT is your quiet office at night, counting the day's profits and deciding which relics to seal behind glass forever.

The satisfaction comes from the moment when you see a heresy event fire, immediately recognize the affected saint, snap-buy their relics at the depressed price, and sell them 30 seconds later at a 35% profit. Or the longer arc: spending three days patiently assembling TERESA relics, passing up profitable flips to enshrine pieces, and finally locking in the 8th piece on Day 9 with the celebratory overlay.

The loss condition isn't bankruptcy. It's looking at the clock on Day 12 and realizing you traded brilliantly but enshrined too late, or enshrined too early and ran out of trading capital, or got greedy chasing FRANCIS (13 relics) instead of playing it safe with TERESA (8 relics).

That's a game about judgment, not just reflexes or luck. And it's built on the foundation you already have.

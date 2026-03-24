# HOLY_OPS.EXE — Trading Terminal UX Research Report

## From Auction House to Relic Exchange: A Financial Terminal Design Perspective

---

## 1. What Makes Bloomberg Terminal Compelling as a UX Paradigm

### The Core Insight: Density Is Not Clutter

The Bloomberg Terminal succeeds not despite its density but because of it. When Bloomberg's CTO Shawn Edwards describes their approach, the key phrase is "concealing complexity" — not removing it. The Terminal displays scrolling sparklines, detailed volume breakdowns, tables with dozens of columns, and global headlines simultaneously on a single screen. For a professional, every pixel carries signal. What looks like chaos to an outsider is actually a carefully orchestrated information hierarchy that a trained eye can parse in under a second.

This is the exact aesthetic HOLY_OPS already has in embryo. The BSP grid, the ticker sidebar, the terminal feed, the saint tracker — you have four information streams running simultaneously. That is correct. The mistake would be to simplify it.

### What Specifically Translates to a Game Context

**Keyboard-driven speed.** Bloomberg users navigate between dozens of views in milliseconds using function keys and typed commands. The colored keys on the Bloomberg keyboard (green for GO/execute, yellow for market sectors, red for STOP) have become muscle memory. HOLY_OPS should steal this aggressively. The current bid buttons (+10, +50, +100) are mouse-only. A trader would want:
- Number keys 1-8 to select lots by position in the ticker
- Spacebar or Enter to confirm a bid
- Arrow keys to cycle through lots
- F-keys or letter shortcuts for common actions (B for bid, S for sell, P for portfolio)

The point is not that keyboard shortcuts are "nice to have." In a time-pressured trading game, the difference between clicking and pressing a key is the difference between winning and losing an auction. Bloomberg users will tell you that the keyboard is the product.

**The "Launchpad" model.** Bloomberg's Launchpad lets users create custom multi-panel layouts where each panel is an independent view. The genius is that panels are aware of each other — selecting a security in one panel updates related panels automatically. HOLY_OPS already does a version of this: clicking a lot in the grid updates the BidPanel. But the current three-column layout is static. Consider letting players rearrange or toggle panels — a "market view" that maximizes the grid, a "portfolio view" that maximizes collection tracking, a "sniper view" that shows only lots about to expire.

**Zero-latency feedback.** Bloomberg loads dense data screens instantly. In a game context, this translates to: every player action must produce immediate, visible feedback. The current 2-second "BID PLACED" toast is good. But price changes, new lot spawns, and outbid events should all have instantaneous visual registration. No loading spinners. No transitions that take more than 100ms. The terminal aesthetic demands snappiness.

### What Does Not Translate

**Multi-monitor sprawl.** Bloomberg users run 4-6 monitors. A browser game gets one viewport. This means the BSP grid has to work harder — it is simultaneously the watchlist, the order book, and the alert system. Do not try to replicate Bloomberg's breadth. Instead, replicate its depth within a single screen.

**Steep learning curves measured in weeks.** Bloomberg professionals spend 20+ hours learning the terminal. A game player will give you 30 seconds. The tutorial overlay is the right instinct, but the real onboarding is progressive disclosure — let the first few minutes be simple buying, then introduce selling, then introduce market mechanics, then introduce advanced order types.

**The social/messaging layer.** Bloomberg's chat (IB) is a massive part of its value. Unless HOLY_OPS goes multiplayer, this has no analogue. However, the terminal feed already fills this slot thematically — heresy reports as the "news wire" is a strong conceit.

---

## 2. Trading Mechanics That Could Work in a Game

### The Minimum Viable Trading Vocabulary

For a buy-low-sell-high game loop, you need exactly five concepts that players must internalize:

1. **Market Price** — What a relic is "worth" right now (determined by recent transaction history)
2. **Bid/Ask** — What buyers are offering vs. what sellers are asking
3. **Spread** — The gap between bid and ask (where profit lives)
4. **Position** — What you own and what you paid for it
5. **P&L** — Whether you are up or down on a position

Everything else is optional depth. Here is how the more advanced concepts break down:

### Order Types (Simplified)

**Market Order (buy/sell immediately at current price).** This is what HOLY_OPS currently has — you bid, you pay. For selling, a market order would mean "sell this relic to the best available buyer right now." Simple. Immediate. Slightly worse price than you might get if you waited.

**Limit Order (buy/sell only at a specific price or better).** This is the first interesting mechanic. "I will sell Teresa's Heart, but only if someone offers 400 or more." The player sets a price and waits. This creates tension: set the price too high and it never fills; set it too low and you leave money on the table. Limit orders would let players set traps — leave sell orders open while they focus on buying other relics.

**Stop Loss (automatically sell if price drops below a threshold).** This is probably too abstract for a game. Skip it.

### The Order Book (Simplified for a Single-Player Game)

A real order book has hundreds of buy and sell orders stacked at different price levels. For HOLY_OPS, the "order book" could be simplified to:

- **AI Buyers** who periodically post buy orders for relics at various prices. These represent the "market" — monasteries, collectors, rival brokers, zealot cults. Each buyer has a personality: some are aggressive (bid high, buy fast), some are patient (low bids, wait forever), some are specialists (only want Class I relics, only want specific saints).

- **The Player** who can post sell orders (limit orders at specific prices) or sell immediately to the highest AI buyer (market orders).

- **Price Discovery** happens through the interplay of AI demand and relic scarcity. If Francis relics keep getting bought up, AI buyers start offering more for the remaining ones. If nobody is buying Bartholomew's relics, prices drift down.

### Concepts to Simplify Away

**Short selling.** Too confusing and thematically weak (how do you "borrow" a saint's femur?). Skip entirely.

**Margin trading.** Same problem. Leverage is not fun in a game — it is stressful in reality and opaque in fiction.

**Arbitrage (simplified version).** Different AI buyer factions could offer different prices for the same relic. The Flagellants might pay 300 for Sebastian's Arrow-Pierced Rib, while the Gnostic Order only values it at 180. Scanning for these pricing discrepancies IS fun gameplay and maps directly to real arbitrage. The player becomes a relic arbitrageur — buy from the cheap faction, sell to the expensive one.

**Market Manipulation (fun version).** If the player buys up all of a saint's relics, the remaining ones become scarcer. AI buyers should respond to scarcity — prices rise when supply is low. The player could corner the market on a specific saint, drive prices up, then sell a few relics at inflated prices before completing the set. This is genuinely strategic and maps to real market dynamics (cornering a commodity).

### The Auction-to-Market Transition

The current auction mechanic does not need to be replaced — it needs to be complemented. Auctions are the BUY side. The new market is the SELL side. The game loop becomes:

1. **Buy relics at auction** (existing mechanic, time-pressured, competitive)
2. **Hold relics as inventory** (new: relics have fluctuating market value)
3. **Sell relics on the market** (new: choose when and at what price to sell)
4. **Use profits to buy more relics** (the capital accumulation loop)
5. **Complete saints** (the victory condition, now requiring strategic buying AND selling)

---

## 3. Position Management UX

### What Real Trading Terminals Show

A Bloomberg portfolio view (the PORT function) displays:
- **Positions**: What you own, quantity, average cost basis
- **Market Value**: Current value based on live prices
- **Unrealized P&L**: How much you are up or down on each holding, both in absolute terms and percentage
- **Realized P&L**: Profit/loss on positions you have already closed
- **Allocation**: What percentage of your portfolio is in each asset
- **Risk Metrics**: Exposure, concentration, correlation

### The Relic Portfolio View

For HOLY_OPS, the portfolio view maps cleanly onto the existing Collection panel, but with critical additions:

```
PORTFOLIO — NET WORTH ◈ 3,847  [CASH ◈ 1,200 | HOLDINGS ◈ 2,647]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RELIC                 SAINT       PAID    MKT     P&L     ACTION
Third Metacarpal      AMBROSE     ◈ 120   ◈ 185   +54%    [SELL]
Vial of Blood         AMBROSE     ◈ 340   ◈ 290   -15%    [SELL]
Left Ulna             LUCIA       ◈ 88    ◈ 112   +27%    [SELL]
Arrow-Pierced Rib     SEBASTIAN   ◈ 205   ◈ 380   +85%    [SELL]
Cilice Belt           TERESA      ◈ 45    ◈ 52    +16%    [SELL]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAINT EXPOSURE:
  AMBROSE     2/12  ◈ 475  [████░░░░░░░░]  38% of holdings
  LUCIA       1/10  ◈ 112  [█░░░░░░░░░░░]   9% of holdings
  SEBASTIAN   1/12  ◈ 380  [█░░░░░░░░░░░]  30% of holdings
  TERESA      1/8   ◈ 52   [█░░░░░░░░░░░]   4% of holdings
```

Key design decisions:

**Show cost basis always.** The player must see what they paid vs. what something is worth now. This is the core feedback loop that makes trading feel real. Green numbers for gains, red for losses. Simple, universal, effective.

**Show "completion cost estimate."** For each saint, estimate what it would cost to acquire the remaining relics at current market prices. "AMBROSE: 10 relics remaining, est. ◈ 1,800 to complete." This helps the player make strategic decisions — is it cheaper to complete Teresa (fewer relics, lower prices) or to sell off Sebastian relics at a profit and pivot?

**Net worth as the score.** The current game uses "currency remaining" as the implicit score. The pivot to trading means the real score is net worth: cash + market value of all held relics. This number should be prominently displayed and should fluctuate in real time as market prices change. Watching your net worth tick up (or down) is inherently compelling.

**"Locked" vs. "Tradeable" relics.** Once you have decided to complete a saint, you might want to "lock" certain relics so you do not accidentally sell them. This is analogous to moving positions to a "hold" account in real trading. Locked relics show a lock icon and cannot be sold. Unlocking requires a deliberate action.

---

## 4. Market Data Visualization

### The Challenge: 85 Relics, One Screen

You have 85 relics across 8 saints. Each has a price history. Showing all of this simultaneously is impossible and unnecessary. The solution is hierarchical: show the forest, let the player zoom into trees.

### Level 1: The Heat Map (Saint-Level Overview)

A heat map where each saint is a block, sized by total market value or number of active listings, colored by price trend:
- **Green**: Prices rising (good time to sell, expensive to buy)
- **Red**: Prices falling (good time to buy, bad time to sell)
- **Yellow/Neutral**: Stable prices

This gives an instant "state of the market" read. Real trading terminals use heat maps extensively (Bloomberg's IMAP, the S&P 500 tree maps). The BSP grid already uses a tree-map layout — repurposing this for market overview is natural.

### Level 2: The Sparkline Strip (Relic-Level Trends)

For each relic in the portfolio or in a saint's detail view, show a tiny sparkline (30-50px wide, 12px tall) showing the last N price points. Bloomberg puts sparklines everywhere — next to stock symbols, in tables, in dashboards. They communicate trend (up, down, volatile, stable) without requiring the player to open a chart.

In the grid cells, replace or supplement the static current bid with a sparkline. A lot showing a flat line at ◈ 50 reads very differently from one showing a spike from ◈ 50 to ◈ 200.

### Level 3: The Price Chart (On-Demand Detail)

When a player selects a relic (either from portfolio or from market), show a proper price chart in the BidPanel area. This does not need to be a full candlestick chart — a simple line chart with:
- Price history (last 20-30 transactions or time periods)
- A horizontal line showing the player's cost basis (if they own it)
- Volume bars below the chart (how many transactions per period)
- A simple moving average line to show the trend

Keep the chart monochrome with accent colors. Green line for price, gold horizontal for cost basis, muted bars for volume. The terminal aesthetic means thin lines, small text labels, no gradients.

### Level 4: The Ticker Tape (Real-Time Transaction Feed)

Transform the terminal feed from purely heresy messages into a dual-purpose feed:
```
[MKT] AMBROSE Third Metacarpal sold ◈ 185 (+12%)
[MKT] LUCIA Eyes of St. Lucia sold ◈ 440 (-3%)
[SEC] Canonical verification: PASS
[!!! ] FLAGELLANTS intercept detected — TRIBUNAL DELAY
[MKT] SEBASTIAN Arrow-Pierced Rib bid ◈ 350 (new high)
```

Market transactions interspersed with heresy reports and system messages. This mimics a real trading terminal's news/transaction ticker and gives the player ambient awareness of price movements across the entire market without having to check each relic individually.

### Visualization Principles

**Color means the same thing everywhere.** Green = up/good/winning. Red = down/bad/losing. Gold = currency/your stuff. Blue = neutral/system. This is already mostly true in HOLY_OPS. Do not deviate from it.

**Numbers should be scannable.** Right-align all prices. Use consistent decimal places (or no decimals — relics probably trade in whole numbers). Show change as both absolute and percentage: "◈ 185 (+12%)" is more readable than either alone.

**Animate changes, not states.** When a price changes, briefly flash the number (green flash for increase, red for decrease). Then return to static. Do not leave things perpetually animated — it creates visual noise. The current outbid-pulse animation is appropriate for its context but should not be applied to every price update.

---

## 5. The "Terminal Feel"

### Essential UI Elements

**The command line.** Even if it is vestigial, a text input at the top or bottom of the screen that accepts typed commands is the single strongest "this is a terminal" signal. It does not need to support complex syntax. Even supporting just a few commands would add enormous flavor:

```
> BUY LOT-0042          (select and bid on a lot)
> SELL ambrose-3 185     (post a sell order)
> PORT                   (open portfolio view)
> SAINT AMBROSE          (show saint detail)
> MKT                    (show market overview)
> HELP                   (list commands)
```

This doubles as a power-user shortcut system. New players ignore it and click buttons. Experienced players type commands for speed. This is exactly how Bloomberg works — every function has a clickable menu path AND a typed command.

**Function key labels.** A strip at the bottom of the screen showing context-sensitive function key assignments:

```
F1 HELP | F2 PORT | F3 MKT | F4 SELL | F5 LOCK | ESC CLOSE
```

Bloomberg has this exact pattern. It reinforces the terminal fantasy and teaches keyboard shortcuts simultaneously.

**Status bar.** A bottom bar showing:
```
HOLY_OPS v0.1 | NET WORTH ◈ 3,847 | LOTS ACTIVE 24 | TRIBUNAL CLEAR | 14:32:07
```

Always-visible system status. The clock is important — it grounds the player in the passage of time and creates urgency even when no specific lot is about to expire.

**Blinking cursor.** In the command line input, a blinking block cursor (not a thin line cursor). Green or amber. This is a pure aesthetic choice but it is the single most recognizable "terminal" visual element in existence.

### Color Coding Conventions

The current palette is strong. Specific additions for trading:

| Color | Meaning | Usage |
|-------|---------|-------|
| Bright Green (#00ff00 or similar) | Price increase / profit | P&L numbers, price change flashes |
| Red (existing --destructive) | Price decrease / loss | P&L numbers, price change flashes |
| Gold (existing --accent) | Currency / your positions | Your bids, your portfolio value |
| Cyan | Market data / information | Transaction feed entries, sparklines |
| White/foreground | Static labels / headers | Column headers, section titles |
| Muted (existing) | Inactive / historical | Closed lots, past transactions |

### Alert Systems

**Audio cues (optional, brief, lo-fi).** The wololo easter egg proves the audio system works. Consider adding:
- A soft click/tick when your bid is placed (confirmation)
- A low warning tone when you are outbid (needs attention)
- A cash register "ka-ching" when a sale completes at a profit (dopamine)
- A deeper tone for loss (learning signal)

All should be processed through the same lo-fi filter as the wololo — muffled, quiet, period-appropriate. Think of a medieval market bell, not a stock exchange klaxon.

**Visual alerts with severity levels.** Borrow from Bloomberg's alert tiering:
- **CRITICAL (red flash, top of screen):** You are being outbid on a lot about to expire
- **WARNING (gold border pulse):** A relic you own has dropped significantly in value
- **INFO (ticker entry):** A relic you are tracking has a new listing
- **SYSTEM (muted):** Background market activity

### Capturing the Aesthetic Without Requiring Financial Literacy

The trick is to use trading terminal visual language while mapping every concept to something concrete:

| Terminal Concept | Relic Exchange Translation |
|-----------------|---------------------------|
| Stock ticker symbol | Saint abbreviation + relic short name (AMB-METACARPAL) |
| Market cap | Total value of all relics for a saint |
| Volume | Number of auctions/trades per time period |
| 52-week high/low | All-time high/low price for a relic |
| Sector | Saint (each saint is a "sector" of the relic market) |
| Index | Overall market health (average relic prices trending up or down) |
| Portfolio | Your relic collection with cost basis |
| Watchlist | Saints you are targeting for completion |

The player does not need to know what a "52-week high" is in financial terms. They see "ALL-TIME HIGH ◈ 440" next to a relic and understand that this relic is expensive right now. The terminal vocabulary becomes the game's flavor text, not a prerequisite.

---

## 6. Buy-Low-Sell-High Game Loops That Work

### Lessons from Games That Got Trading Right

**EVE Online's market** is the gold standard for player-driven trading in games. The critical lesson from EVE is that the market is a game within the game — station traders in EVE never undock their ships, spending hours watching order books and adjusting prices by 0.01 ISK to undercut competitors. What makes this work: real scarcity (items are destroyed in combat), real demand (players need ships and modules), and information asymmetry (knowing which items are about to spike in demand is valuable knowledge). For HOLY_OPS, the analogue is: relics should feel scarce (limited supply per saint), demand should fluctuate (AI factions change their priorities), and information should be earnable (watching the market feed reveals patterns).

**Recettear's pricing system** is a cautionary tale about depth. The haggling mechanic — where you set a price and customers counter-offer — is initially engaging but degenerates into a rote exercise once you learn the formulas. The IGN review noted that it becomes a "thoughtless, mechanical exercise." The saving grace is market fluctuations: buy-low-sell-high works because item prices change over time, forcing adaptation. The lesson: do not let the selling mechanic become a solved optimization. Inject randomness and shifting conditions.

**GTA 5's stock market** is brilliant because it ties stock prices to in-game events. Blow up a company's rival, and their stock goes up. The lesson for HOLY_OPS: relic prices should respond to game events. A heresy event involving the Flagellants should affect demand for relics associated with martyrdom. A "relic authentication scandal" event could temporarily crater prices on Class III relics. The connection between narrative events and price movements makes trading feel like part of the world, not a spreadsheet exercise.

### The Ideal Tension Between Skill and Luck

The formula, derived from studying what works across financial games:

**~60% skill, ~25% readable randomness, ~15% pure chaos.**

- **Skill (60%):** Pattern recognition (which relics are trending up), capital management (when to hold cash vs. invest), timing (when to buy at auction vs. when to sell on market), saint strategy (which saints to target based on market conditions).

- **Readable randomness (25%):** Market fluctuations that follow patterns a careful player can detect. "Class I relics spike in value every time a Flagellant heresy event fires." "Ambrose relics are cheap in the early game but expensive later." These are not random — they are systems the player can learn. But they are not deterministic either. The Flagellant event does not always spike Class I prices. It spikes them 70% of the time.

- **Pure chaos (15%):** Black swan events. A "Great Relic Forgery" that temporarily makes all Class III relics worthless. A "Papal Bull" that doubles the value of a random saint. These keep experts on their toes and occasionally give new players a windfall that teaches them what is possible.

### The Dopamine Architecture

What makes trading satisfying moment-to-moment:

1. **The "I saw it coming" moment.** Player notices Lucia relics trending down, buys three at low prices, watches them recover. Profit. This is the core satisfying loop — pattern recognition rewarded.

2. **The "clutch sell."** Player owns a relic that has spiked to 3x its purchase price. They sell right before the price crashes. Timing rewarded. Even if the timing was partially lucky, it feels like skill.

3. **The "strategic sacrifice."** Player sells a relic they need for saint completion because the profit is too good to pass up. They trust they can re-acquire it later at a lower price. This is the fundamental tension of the buy-low-sell-high loop — completion (the goal) vs. profit (the means).

4. **The "corner play."** Player realizes they own 10 of 12 Ambrose relics. The last two are being offered at auction. AI buyers are desperate for them. The player bids aggressively knowing that completing Ambrose will be worth far more than the overpay. Market awareness enabling strategic aggression.

### What Makes Trading Frustrating (Avoid These)

- **Opaque pricing.** If the player cannot understand WHY a price changed, the market feels arbitrary, not strategic. Always provide a reason: "Cathari demand surge" next to a price spike.

- **Irreversible mistakes with no recovery path.** If a player sells a rare relic at a bad price and it never appears again, the game is soft-locked. Ensure relics re-enter the market periodically. The auction system already supports this — just allow relics the player has sold to appear in future auctions.

- **Grind without decision-making.** If the optimal strategy is just "buy everything, sell everything that went up, repeat," trading becomes tedious. The game needs moments where the player must choose: sell this relic for profit, or keep it for completion? Buy this underpriced relic that is not in your target saint, or save cash for one that is?

- **Time pressure without information.** Auctions are inherently time-pressured, and that is fine — the player can make fast decisions about whether to bid. But selling decisions should NOT be time-pressured. The sell side should be contemplative. Look at your portfolio, think about the market, set your prices, and wait. This contrast between frantic buying and deliberate selling creates rhythm.

### Proposed Game Loop Rhythm

```
PHASE 1: SCAN (5-10 seconds)
  Check the market heat map. Which saints are hot? Which are cold?
  Check the ticker feed. Any heresy events about to shift demand?

PHASE 2: BUY (ongoing, reactive)
  Auctions are live. Bid on underpriced relics.
  Buy relics you need for completion.
  Buy relics that are cheap and trending up (speculation).
  Exploit heresy freezes for unopposed bidding.

PHASE 3: MANAGE (whenever, deliberate)
  Review portfolio. Which relics are profitable to sell?
  Set sell orders at target prices.
  Lock relics you want to keep for completion.
  Adjust strategy based on net worth and completion progress.

PHASE 4: SELL (asynchronous)
  AI buyers fill your sell orders over time.
  Market transactions appear in the feed.
  Cash returns to your balance.
  New buying opportunities open up.

REPEAT until saints are completed or player runs out of capital.
```

This creates two tempos: the frantic real-time auction pace (PHASE 2) and the strategic portfolio management pace (PHASE 3). Bloomberg traders live in this dual-tempo world — scanning for opportunities at speed, then carefully constructing positions with deliberation. It is what makes trading engaging over hours, not just minutes.

---

## Appendix: Quick Implementation Priority

If I were advising on what to build first:

1. **Relic market prices** — Every relic gets a fluctuating "market value" independent of auction prices. This is the foundation everything else builds on.

2. **Sell mechanic** — A simple "sell to market at current price" button in the portfolio view. No limit orders yet, just instant sells. This alone transforms the game from "spend budget" to "manage capital."

3. **Portfolio view with P&L** — Show what you own, what you paid, what it is worth now. Green and red numbers. This is where trading becomes emotionally engaging.

4. **Market event system** — Heresy events and other game events influence relic prices. This makes the market feel alive and learnable.

5. **Price history sparklines** — Small visual price histories on grid cells and portfolio items. Massive information density increase for minimal UI cost.

6. **Limit sell orders** — Let the player set a price and wait. This adds strategic depth beyond "sell now."

7. **Command line** — The crown jewel of the terminal feel. Even a basic one elevates the entire aesthetic.

---

## Sources

- [How Bloomberg Terminal UX Designers Conceal Complexity](https://www.bloomberg.com/company/stories/how-bloomberg-terminal-ux-designers-conceale-complexity/)
- [UI Density — Matt Strom](https://mattstromawn.com/writing/ui-density/)
- [Hacker News Discussion on Information-Dense UIs](https://news.ycombinator.com/item?id=19153875)
- [Core77: Moneymaking Multi-Monitor Mayhem](https://www.core77.com/posts/24893/moneymaking-multi-monitor-mayhem-and-why-some-prefer-interface-design-that-sucks-24893)
- [EVE University: Trading Guide](https://wiki.eveuniversity.org/Trading)
- [Brave Collective: Station Trading Complete Guide](https://wiki.bravecollective.com/public/dojo/wiki/station_trading_complete_guide)
- [EVE Market Strategies (GitHub)](https://github.com/OrbitalEnterprises/eve-market-strategies)
- [Recettear Wiki: Haggling Mechanics](https://recettear.fandom.com/wiki/Haggling)
- [Recettear Wiki: Pricing Strategies](https://recettear.fandom.com/wiki/Pricing_Strategies)
- [Recettear: Steam Community Guide — Market Math Revealed](https://steamcommunity.com/sharedfiles/filedetails/?id=336404171)
- [Somco Software: Trading GUI Design](https://somcosoftware.com/en/blog/trading-gui-building-interfaces-for-financial-applications)
- [Token Place: Trading Terminal UX Case Study](https://merge.rocks/case-studies/token-place)
- [Relaunching Bloomberg Launchpad](https://www.bloomberg.com/ux/2017/11/10/relaunching-launchpad-disguising-ux-revolution-within-evolution/)

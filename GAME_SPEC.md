# HOLY_OPS.EXE — Relic Exchange Terminal v0.1

## Game Specification & Technical Documentation

---

## 1. Overview

**HOLY_OPS.EXE** is a single-player real-time auction game set in a fictional underground relic exchange. The player is a broker of sacred bones, teeth, and splinters — bidding against AI-driven zealots for the scattered remains of saints.

**Genre:** Real-time strategy / auction simulator
**Platform:** Web (React + TypeScript + Vite)
**Aesthetic:** Retro terminal / Bloomberg terminal meets medieval reliquary

### Core Loop

1. Lots (relics for sale) spawn continuously on a live grid
2. Player and AI bidders compete in real-time timed auctions
3. Winning a lot adds the relic to your collection
4. Collect **every relic** of a saint to "complete" them
5. Budget is fixed at ◈ 5,000 — no refills

### Win Condition

Complete as many saints as possible before running out of currency. There is no formal end state — the game continues as long as there are lots to bid on and currency to spend.

---

## 2. Game Entities

### 2.1 Relic

A single sacred artifact belonging to a saint.

```typescript
interface Relic {
  id: string;           // e.g. "ambrose-3"
  name: string;         // e.g. "Third Metacarpal"
  saintId: string;      // e.g. "ambrose"
  saintName: string;    // e.g. "AMBROSE"
  relicClass: 1 | 2 | 3;
  provenance: string;   // e.g. "Basilica di Sant'Ambrogio, Milan, 1423"
  partIndex: number;    // index within the saint's relic array
}
```

**Relic Classes** (based on Catholic relic classification):
| Class | Description | Examples |
|-------|-------------|---------|
| I — Body Part | Physical remains of the saint | Bones, teeth, hair, blood |
| II — Possession | Items owned/worn by the saint | Veils, tunics, cloths |
| III — Touched Object | Items that touched the saint or their relics | Vials of dust/ash, ampullae |

Classification is determined by keyword matching in `getRelicClass()`.

### 2.2 Lot

A relic currently up for auction.

```typescript
interface Lot {
  id: string;              // e.g. "LOT-0042"
  relic: Relic;
  currentBid: number;      // highest bid so far (◈)
  yourBid: number | null;  // player's last bid, or null if not bid
  bidCount: number;        // total bids placed (player + AI)
  timeRemaining: number;   // seconds until auction closes
  totalTime: number;       // original duration (for weight calc)
  status: 'active' | 'closing' | 'closed' | 'won' | 'lost';
  weight: number;          // BSP grid sizing weight (0.8–3.0)
  flash: 'outbid' | 'win' | null;  // visual flash state
  flashUntil: number;      // timestamp when flash expires
}
```

**Lot Statuses:**
| Status | Meaning |
|--------|---------|
| `active` | Auction is live, accepting bids |
| `closing` | (Reserved, not currently used) |
| `closed` | Auction ended, player didn't bid |
| `won` | Player won the auction |
| `lost` | Player bid but was outbid at close |

### 2.3 Saint

A saint whose relics the player is collecting.

```typescript
interface Saint {
  id: string;
  name: string;
  totalRelics: number;
  collectedRelics: string[];  // names of relics won
}
```

### 2.4 GameState

The root state object.

```typescript
interface GameState {
  currency: number;              // remaining budget
  lots: Lot[];                   // all lots (active + recently resolved)
  saints: Saint[];               // collection progress
  completedSaint: string | null; // triggers completion overlay
  lotCounter: number;            // for generating LOT IDs
}
```

---

## 3. Saints & Relics Data

Eight saints, each with 8–13 relics (85 total relics across all saints):

| Saint | Relics | Provenance |
|-------|--------|------------|
| **AMBROSE** | 12 | Basilica di Sant'Ambrogio, Milan |
| **LUCIA** | 10 | Church of SS. Geremia e Lucia, Venice |
| **SEBASTIAN** | 12 | Basilica of San Sebastiano, Rome |
| **TERESA** | 8 | Convento de Santa Teresa, Ávila |
| **BARTHOLOMEW** | 11 | Basilica di San Bartolomeo, Rome |
| **AGATHA** | 9 | Cathedral of Sant'Agata, Catania |
| **FRANCIS** | 13 | Basilica di San Francesco, Assisi |
| **CATHERINE** | 10 | Basilica di San Domenico, Siena |

Each saint's relics are body parts, possessions, or contact relics thematically tied to their hagiography (e.g., Lucia has eyes, Sebastian has arrow-pierced ribs, Teresa has her transverberated heart).

---

## 4. Game Engine (`src/game/engine.ts`)

### 4.1 Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `STARTING_CURRENCY` | 5,000 | Initial budget |
| `INITIAL_LOTS` | 18 | Lots spawned at game start |
| `MAX_LOTS` | 30 | Maximum simultaneous active lots |
| `LOT_SPAWN_INTERVAL` | 5,000 ms | New lot every 5 seconds |
| `TICK_INTERVAL` | 1,000 ms | Game clock tick rate |
| `AI_BID_INTERVAL` | 3,000 ms | AI bid evaluation cycle |

### 4.2 Lot Creation

- A random saint is chosen, then a random uncollected relic from that saint
- Starting bid: random 15–150 ◈
- Duration: random 45–150 seconds
- Duplicate prevention: active lots cannot contain the same relic ID
- Up to 10 attempts to find a non-duplicate relic before giving up

### 4.3 Player Bidding (`placeBid`)

```
placeBid(state, lotId, amount) → GameState
```

Validation:
- Lot must exist and be `active`
- Amount must exceed `currentBid`
- Amount must not exceed `currency`

On success:
- `currentBid` updated to new amount
- `yourBid` set to new amount
- `bidCount` incremented
- `weight` increased by 0.3 (capped at 3.0)
- Currency is **not** deducted until the lot is won

### 4.4 Game Tick (`tick`)

Runs every 1 second. Per-lot processing:

1. **Clear expired flashes** (outbid/win visual effects)
2. **Decrement timer** by 1 second
3. **Recalculate weight:**
   ```
   weight = 0.8 + (1 - timeRatio) × 0.8 + activityBoost + yourBidBoost
   ```
   - `timeRatio` = timeRemaining / totalTime (lots get bigger as they expire)
   - `activityBoost` = min(bidCount × 0.1, 0.8)
   - `yourBidBoost` = 1.0 if player has bid, else 0 (keeps your lots prominent)
   - Additional +0.5 if under 15 seconds remaining
4. **Resolve expired lots** (timeRemaining ≤ 0):
   - If player's bid ≥ current bid → `status = 'won'`, gold flash
   - If player bid but was outbid → `status = 'lost'`
   - If player never bid → `status = 'closed'`
5. **Process wins:**
   - Add relic to saint's `collectedRelics`
   - Deduct `currentBid` from currency
   - If saint is now complete → trigger `completedSaint` overlay
6. **Garbage collect:** Remove resolved lots after 2 seconds (timeRemaining < -2)

### 4.5 Lot Spawning (`spawnLot`)

- Runs every 5 seconds
- Only spawns if active lot count < 30
- Increments `lotCounter` for unique LOT IDs

### 4.6 AI Bidding (`aiBids`)

Runs every 3 seconds. For each active lot:

| Time Remaining | Bid Chance |
|---------------|------------|
| < 10s | 20% |
| < 30s | 8% |
| ≥ 30s | 3% |

Bid increment: random between 3 and max(8, currentBid × 8%)

If the AI outbids the player:
- `flash` set to `'outbid'`
- `flashUntil` set to now + 1500ms
- Grid cell pulses red

AI bidders are **paused** during heresy slowdown events.

---

## 5. Heresy System (`src/game/heresy.ts`)

### 5.1 Concept

The terminal feed displays a mix of system messages and heresy reports from five fictional heterodox sects. Heresy events create a strategic "freeze window" where the player can bid unopposed.

### 5.2 Sects

| Sect | Color |
|------|-------|
| FLAGELLANTS | Red (`--sect-red: 0 75% 55%`) |
| CATHARI | Cyan (`--sect-cyan: 185 80% 55%`) |
| GNOSTIC ORDER | Magenta (`--sect-magenta: 300 65% 60%`) |
| BOGOMILS | Lime (`--sect-lime: 100 70% 50%`) |
| WALDENSIANS | Orange (`--sect-orange: 30 90% 55%`) |

### 5.3 Message Generation

Every 2.5 seconds (`FEED_INTERVAL`), a new message is generated:
- **35% chance** → Heresy report (random sect + random template)
- **65% chance** → System message (benign status update)

**Heresy templates** include tribunal alerts, intercepts, breach reports, sweeps, and edicts — all procedurally filled with a random sect name.

**System messages** are flavor text: "Market tick synchronized", "Canonical verification: PASS", etc.

### 5.4 Heresy Slowdown

When a heresy report fires:
- `slowedUntil` is set to `Date.now() + 4000ms`
- For 4 seconds:
  - The game tick alternates skipping (effectively half-speed timers)
  - AI bidders are completely paused
  - The title bar shows `▓ TRIBUNAL DELAY ▓`
  - The terminal header shows `▓ HERESY DETECTED — MARKET DELAY ▓`
- **Strategic implication:** The player can bid during this window without AI competition

### 5.5 Message Buffer

Messages are kept in a rolling buffer: max 80, trimmed to last 60 when overflow.

---

## 6. BSP Grid Layout (`src/game/bsp.ts`)

### 6.1 Algorithm

The market grid uses **Binary Space Partitioning** to dynamically size auction cells based on their weight. Higher-weight lots get more screen real estate.

```
buildBSP(lots, x, y, w, h) → BSPNode[]
```

1. Sort lots by weight (descending)
2. Choose split axis: horizontal if width ≥ height, vertical otherwise
3. Accumulate weights from the top until reaching 40% of total weight → split point
4. Split ratio clamped to 25%–75%
5. Recurse on both halves
6. Base case: single lot → return leaf node with 1px gap on all sides

**Minimum cell dimensions:** 120×90 pixels

### 6.2 BSPNode

```typescript
interface BSPNode {
  x: number;
  y: number;
  w: number;
  h: number;
  lotId?: string;
}
```

### 6.3 Weight Dynamics

Weights range from ~0.8 to 3.0. Factors that increase weight:
- Nearing expiry (time ratio approaching 0)
- More bids placed
- Player has bid on the lot (+1.0 boost)
- Under 15 seconds remaining (+0.5)

This means **lots you've bid on stay large and visible**, and lots about to expire grow to signal urgency.

---

## 7. UI Architecture

### 7.1 Layout (3-Column Command Center)

```
┌──────────────────────────────────────────────────────┐
│  HOLY_OPS.EXE — Relic Exchange v0.1   ▓ TRIBUNAL ▓  │  ← Title bar (22px)
├──────────────────────────────────────────────────────┤
│  ◈ 5000 │ AMBROSE ██░░ 2/12 │ LUCIA █░░ 1/10 │ ... │  ← Saint tracker (28px)
├────────┬─────────────────────────────┬───────────────┤
│YOUR    │                             │  BID PANEL    │
│BIDS(2) │     BSP MARKET GRID         │  LOT-0042     │
│LOT-042 │  ┌──────┬─────────────┐     │  ◈ 340        │
│LOT-099 │  │      │             │     │  [+10][+50]   │
│────────│  │      │             │     │───────────────│
│ALL LOTS│  ├──────┤             │     │  TRIBUNAL     │
│LOT-001 │  │      ├──────┬──────┤     │  FEED.LOG     │
│LOT-002 │  │      │      │     │     │  [ALERT] ...  │
│LOT-003 │  │      │      │     │     │───────────────│
│  ...   │  └──────┴──────┴──────┘     │  COLLECTION   │
│        │                             │  ◈ 3 relics   │
├────────┴─────────────────────────────┴───────────────┤
```

- **Left column (220px):** `LotTicker` — scrollable lot list with pinned "YOUR BIDS" section
- **Center (flex):** BSP market grid — dynamic treemap of all active lots
- **Right column (320px):** `BidPanel` + `TerminalFeed` + `Collection`

### 7.2 Components

| Component | File | Purpose |
|-----------|------|---------|
| `Index` | `src/pages/Index.tsx` | Root layout, game loop orchestration |
| `GridCell` | `src/components/GridCell.tsx` | Individual auction cell in the BSP grid |
| `LotTicker` | `src/components/LotTicker.tsx` | Left sidebar lot list with bid tracking |
| `BidPanel` | `src/components/BidPanel.tsx` | Right sidebar bid controls & lot detail |
| `TerminalFeed` | `src/components/TerminalFeed.tsx` | Scrolling heresy/system message log |
| `Collection` | `src/components/Collection.tsx` | Won relics catalogue grouped by saint |
| `SaintTracker` | `src/components/SaintTracker.tsx` | Top bar saint completion progress |
| `SaintCompleteOverlay` | `src/components/SaintCompleteOverlay.tsx` | Full-screen completion celebration |
| `TutorialOverlay` | `src/components/TutorialOverlay.tsx` | 6-page interactive onboarding |

### 7.3 GridCell Details

Each cell displays:
- Title bar with LOT ID and status dot
- Relic name (hidden on tiny cells < 150px)
- Saint name with collection progress `[collected/total]`
- Current bid in ◈
- Player's bid if outbid (shown in red)
- Countdown timer (red when < 30s)
- Bid count (hidden on small cells < 200px)
- Relic image as background watermark (18% opacity)

**Visual states:**
| State | Border | Animation |
|-------|--------|-----------|
| No bid | Default cell border | None |
| Winning | 3px green left border | None |
| Outbid | 3px red left border | `outbid-pulse` (1.2s infinite) |
| Selected | 2px gold (accent) border | None |
| Outbid flash | Red background flash | `flash-red` (0.6s) |
| Win flash | Gold background flash | `flash-gold` (0.8s) |

**Easter egg:** ~5% of cells contain a hidden AoE2 wololo monk sprite (24×24, 60% opacity). Clicking it plays a distorted wololo sound via Web Audio API.

### 7.4 LotTicker (Left Sidebar)

Two sections:
1. **YOUR BIDS** — Pinned at top, shows only lots where `yourBid !== null`, sorted by time remaining. Displays WIN/OUTBID status labels.
2. **ALL LOTS** — Scrollable list of all active lots sorted by time remaining. Shows current bid, status, and timer.

Clicking any row selects it (highlights the grid cell and populates the BidPanel).

### 7.5 BidPanel (Right Sidebar)

When a lot is selected:
- Lot ID, relic name, saint progress
- Current bid and timer
- Status indicator (WINNING / OUTBID)
- Quick bid buttons: +10, +50, +100 (added to current bid)
- Manual bid input with BID button
- Confirmation toast: "BID PLACED ◈ {amount}" for 2 seconds
- Available currency display
- ESC to close

When no lot selected: "Select a lot to bid" with currency display.

### 7.6 Collection Panel

Bottom of right sidebar (160px height). Shows won relics grouped by saint:
- Saint name with progress fraction
- 28×28 relic images with golden drop-shadow
- Hover tooltip showing relic name

---

## 8. Audio System (`src/game/audio.ts`)

Single audio effect: the wololo monk easter egg.

**Processing chain:**
```
AudioBufferSource → WaveShaper (distortion) → BandpassFilter (800Hz, Q=2) → Gain (0.08) → Destination
```

- Distortion curve: soft clipping via `π+50 * x / (π + 50|x|)`
- Bandpass filter creates a lo-fi, muffled effect
- Very quiet (gain 0.08) to avoid startling the player
- Fails silently if audio context is unavailable

---

## 9. Visual Design System

### 9.1 Color Palette (HSL)

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | 240 12% 4% | Deep navy-black app background |
| `--foreground` | 240 2% 80% | Primary text |
| `--primary` | 225 100% 58% | Blue — borders, active elements |
| `--accent` | 45 100% 50% | Gold — currency, highlights, urgency |
| `--destructive` | 0 72% 51% | Red — outbid, danger |
| `--success` | 142 72% 45% | Green — winning, acquired |
| `--secondary` | 240 6% 14% | Subtle hover/selection backgrounds |
| `--muted-foreground` | 240 2% 55% | De-emphasized text |
| `--cell-bg` | 240 10% 6% | Grid cell background |
| `--cell-titlebar` | 240 8% 11% | Cell title bar background |
| `--cell-border` | 225 100% 58% | Blue cell borders (matches primary) |

### 9.2 Sect Colors

| Sect | HSL |
|------|-----|
| Flagellants | 0 75% 55% (red) |
| Cathari | 185 80% 55% (cyan) |
| Gnostic Order | 300 65% 60% (magenta) |
| Bogomils | 100 70% 50% (lime) |
| Waldensians | 30 90% 55% (orange) |

### 9.3 Typography

Monospace font stack: `'SF Mono', 'Cascadia Code', 'Consolas', 'Fira Code', monospace`

Font sizes are deliberately small to maintain the terminal aesthetic:
- Title bars: 9px
- Cell content: 9–13px
- Bid panel: 10–12px
- Currency display: 11px

### 9.4 Animations

| Animation | Duration | Purpose |
|-----------|----------|---------|
| `flash-red` | 0.6s | Outbid notification on grid cell |
| `flash-gold` | 0.8s | Win notification on grid cell |
| `saint-reveal` | 2.0s | Saint completion overlay (scale + fade) |
| `outbid-pulse` | 1.2s infinite | Pulsing red left border on outbid cells |

### 9.5 Border Radius

`--radius: 0px` — Everything is sharp-cornered, reinforcing the terminal aesthetic.

---

## 10. Relic Images (`src/game/relicImages.ts`)

31 golden reliquary images are assigned to relics via consistent hashing:

```
index = hashCode(relicId) % RELIC_IMAGES.length
```

The hash function is a simple string hash (shift-5-subtract). This ensures the same relic always gets the same image across sessions.

Images are displayed in grid cells as background watermarks (18% opacity, desaturated) and in the Collection panel at full opacity with a golden drop-shadow.

---

## 11. Game Loop Orchestration (`src/pages/Index.tsx`)

### Intervals

| Interval | Rate | Handler | Notes |
|----------|------|---------|-------|
| Game tick | 1,000ms | `tick()` | Slowed to half during heresy |
| Lot spawn | 5,000ms | `spawnLot()` | Paused at 30 active lots |
| AI bids | 3,000ms | `aiBids()` | Paused during heresy |
| Feed messages | 2,500ms | Generate heresy/system msg | 35% heresy chance |

### State Flow

```
User clicks GridCell/LotTicker → handleSelect(lotId) → selectedLotId updates
  → BidPanel renders with lot details
  → User clicks +10/+50/+100 or types bid → handleBid(lotId, amount)
    → placeBid(state, lotId, amount) → GameState updates
      → GridCell re-renders with new bid status
      → LotTicker "YOUR BIDS" section updates
      → BidPanel shows "BID PLACED" confirmation

AI outbids player → aiBids() → flash='outbid' → GridCell pulses red
  → LotTicker shows "OUTBID" label
  → BidPanel shows "OUTBID" status

Lot expires with winning bid → tick() → status='won'
  → Relic added to saint.collectedRelics
  → Currency deducted
  → Collection panel updates
  → If saint complete → SaintCompleteOverlay shown for 2.5s

Heresy report fires → slowedUntil set → 4s freeze window
  → Tick rate halved, AI paused
  → "TRIBUNAL DELAY" shown in title bar
  → Player can bid unopposed
```

### Selection Behavior

- Clicking a lot always selects it (no toggle — prevents frustration during frantic rebidding)
- ESC key or close button deselects
- Auto-deselects when the selected lot expires

---

## 12. Tutorial System (`src/components/TutorialOverlay.tsx`)

6-page interactive onboarding shown on first load:

| Page | Title | Content |
|------|-------|---------|
| 1 | HOLY_OPS.EXE | Welcome + goal explanation + budget warning |
| 2 | THE GRID | Annotated mock cell + status indicator legend |
| 3 | HOW TO BID | Step-by-step with visual mock of bid bar |
| 4 | RIVALS & HERESY | AI bidder behavior + heresy freeze mechanic + sect legend |
| 5 | COMPLETING SAINTS | Saint tracker explanation + completion overlay preview |
| 6 | QUICK REFERENCE | Keyboard/action reference table |

Features page-dot navigation, back/next buttons, skip button on all pages.

---

## 13. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 + tailwindcss-animate |
| UI Components | shadcn/ui (Radix primitives) |
| Routing | React Router v6 |
| State | React useState/useCallback/useRef (no external state library) |
| Audio | Web Audio API |

### Key Architectural Decisions

- **No external state management:** Game state is a single `useState<GameState>` in `Index.tsx`, updated via pure functions from `engine.ts`
- **Memoized components:** `GridCell`, `LotTicker`, `SaintTracker`, `TerminalFeed`, `Collection` are all wrapped in `React.memo` to prevent unnecessary re-renders during the 1-second tick cycle
- **Pure engine functions:** All game logic (`tick`, `placeBid`, `aiBids`, `spawnLot`) are pure functions that take state and return new state — no side effects
- **CSS-only animations:** All visual effects use CSS keyframes rather than JS animation libraries

---

## 14. File Structure

```
src/
├── game/
│   ├── types.ts          # All TypeScript interfaces
│   ├── engine.ts         # Core game logic (tick, bid, spawn, AI)
│   ├── data.ts           # Saints & relics data, relic classification
│   ├── heresy.ts         # Heresy event system, sects, message generation
│   ├── bsp.ts            # Binary Space Partitioning grid layout
│   ├── audio.ts          # Web Audio wololo sound effect
│   └── relicImages.ts    # Relic-to-image hash mapping
├── components/
│   ├── GridCell.tsx       # Individual BSP grid auction cell
│   ├── LotTicker.tsx      # Left sidebar lot list + bid tracker
│   ├── BidPanel.tsx       # Right sidebar bid controls
│   ├── TerminalFeed.tsx   # Heresy/system message log
│   ├── Collection.tsx     # Won relics catalogue
│   ├── SaintTracker.tsx   # Top bar saint progress
│   ├── SaintCompleteOverlay.tsx  # Completion celebration
│   ├── TutorialOverlay.tsx      # Onboarding tutorial
│   └── NavLink.tsx        # Navigation utility
├── pages/
│   ├── Index.tsx          # Main game page + loop orchestration
│   └── NotFound.tsx       # 404 page
├── index.css              # Design tokens + animations
├── App.tsx                # Router setup
└── main.tsx               # Entry point
```

---

## 15. Strategic Notes for Players

1. **Budget is everything.** ◈ 5,000 sounds like a lot but saints with 12+ relics drain it fast. Pick 1-2 saints and commit.
2. **Exploit heresy freezes.** When the tribunal delay hits, AI stops bidding for 4 seconds. Place bids during this window.
3. **Watch the ticker, not the grid.** The LotTicker's "YOUR BIDS" section is the fastest way to find lots you're losing.
4. **Small saints are easier.** Teresa (8 relics) and Agatha (9 relics) require fewer wins than Francis (13 relics).
5. **Don't overbid early.** AI bid increments are small (3-8% of current bid). Match their pace, don't jump ahead.
6. **Closing lots get expensive.** AI bid chance jumps to 20% in the final 10 seconds. Bid early or bid big.

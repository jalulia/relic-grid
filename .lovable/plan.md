

## Problem

After bidding on a lot, it disappears into the grid and you can't find it again. There's no persistent tracking of "your" lots — the BSP layout reshuffles, cells look the same, and you have zero feedback loop on your bids.

## Solution: Incorporate bid tracking into the 3-column redesign

This builds on the approved 3-column layout plan, with specific additions to solve the "lost bid" problem:

### 1. Lot Ticker (left column) — "Your Bids" section at top

The new `LotTicker.tsx` will have **two sections**:
- **YOUR BIDS** (pinned at top): All lots you've bid on, sorted by time remaining. Shows winning/outbid status with color coding. These never scroll away — they stay visible until resolved.
- **ALL LOTS** (below, scrollable): The full feed of active lots.

Clicking any row selects it and highlights the corresponding grid cell.

### 2. Grid cells — visual distinction for "your" lots

In `GridCell.tsx`, lots where `yourBid !== null` get:
- A persistent colored left border (green if winning, red if outbid) instead of just a tiny dot
- Higher BSP weight so they stay larger and more visible in the grid
- A pulsing border animation when outbid to grab attention

### 3. Bid confirmation feedback

When `placeBid` succeeds in the engine:
- The selected lot flashes briefly (green pulse)
- The bid panel shows "BID PLACED ◈ {amount}" confirmation text for ~2 seconds
- The lot automatically appears in the "YOUR BIDS" pinned section of the ticker

### 4. Win/Loss resolution

When a lot you bid on resolves:
- **Won**: Gold flash on grid cell + moves to Collection panel (bottom-right) + brief "ACQUIRED" toast in bid panel
- **Lost/Outbid**: Red flash + "LOST" indicator in ticker, fades out after 3 seconds

### Files to create/modify

| File | Change |
|------|--------|
| `src/components/LotTicker.tsx` | New — two-section ticker with pinned "Your Bids" |
| `src/components/BidPanel.tsx` | New — replaces BidBar, adds confirmation feedback |
| `src/components/Collection.tsx` | New — won relics catalogue |
| `src/components/GridCell.tsx` | Add colored left border for bid lots, outbid pulse |
| `src/game/engine.ts` | Increase weight boost for `yourBid` lots |
| `src/pages/Index.tsx` | 3-column layout, wire up all new components |
| `src/components/BidBar.tsx` | Remove (replaced by BidPanel) |

### Technical detail

- "Your bids" filter: `lots.filter(l => l.yourBid !== null && l.status === 'active')`
- Weight boost in engine: lots with `yourBid` get `+1.0` weight (currently `+0.5`)
- Outbid pulse: CSS animation `@keyframes outbid-pulse` on border-color between `destructive` and transparent
- Bid confirmation: local state `showConfirm` in BidPanel, cleared after 2s via `setTimeout`


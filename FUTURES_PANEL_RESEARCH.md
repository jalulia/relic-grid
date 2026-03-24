# HOLY_OPS.EXE — Futures Panel Research Report

**Document:** Expansion Mechanic Research — Market Intelligence & Manipulation Systems
**Date:** 2026-03-21
**Status:** Research / Pre-Design
**Author:** Claude (research assist)

---

## Overview

HOLY_OPS.EXE currently operates on a core loop: read the auction board, bid against AI archetypes, manage your relic portfolio across a 12-day session. The Ornstein-Uhlenbeck price model gives relics mean-reverting drift with stochastic shocks. Heresy events inject volatility. AI traders create adversarial pressure. The Bloomberg-terminal aesthetic frames everything in dense, information-rich panels.

This report evaluates six major expansion concepts and several minor ones, all aimed at the same question: **what goes in the empty panel space?** The game needs a secondary information layer — something the player reads, interprets, and acts on beyond the auction itself. A futures panel, a sentiment index, a manipulation toolkit. Something that turns HOLY_OPS from an auction game into a trading game.

Each concept is evaluated on four axes:

- **Historical grounding** — Does it have a real medieval analogue?
- **Mechanical depth** — Does it create interesting decisions?
- **UI clarity** — Can it be rendered as a single Bloomberg-style panel?
- **Implementation complexity** — How much new system logic does it require?

---

## 1. Souls Futures Market

### Historical Grounding

The medieval Church literally sold futures on salvation. The indulgence system, formalized in the 13th century and industrialized by the 15th, was a forward contract on divine favor: pay now, receive reduced time in Purgatory later. The theological backing was the **Treasury of Merit** (Thesaurus Meritorum), a concept formalized by Pope Clement VI in 1343 via the bull *Unigenitus*. The idea: Christ's sacrifice, combined with the surplus merits of the saints, created an infinite reserve of grace. The Church held the keys to this reserve and could dispense withdrawals — for a fee.

This was not metaphorical. Johann Tetzel's famous sales pitch — attributed as "As soon as a coin in the coffer rings, a soul from Purgatory springs" — was the marketing copy for a literal financial instrument. The Fugger banking family underwrote the 1517 indulgence campaign that triggered Luther's 95 Theses. The indulgence was a bond. The Treasury of Merit was the central bank. The Church was the broker.

Relics were the collateral. A saint's bone fragment was not just an object of devotion — it was a claim on that saint's accumulated merit. Owning a relic was like holding equity in a saint's spiritual portfolio. The more miracles attributed to a saint, the higher the merit yield. The relic market and the indulgence market were two sides of the same economy.

### Mechanic Design

**Futures contracts on saint asset classes.** The player can take long or short positions on the price direction of relic categories (Apostolic, Marian, Martyr, Early Church Father, etc.) over a 3-to-5 market day window.

**How it works:**

- A "Souls Futures" panel displays a forward curve for each saint class — a line chart showing the market's implied price trajectory over the next 3-5 days.
- The player buys contracts at the current implied forward price. If the actual price at expiry exceeds the contract price, the player profits. If it falls short, the player loses their margin.
- Contract pricing is derived from the O-U model's mean-reversion parameter plus any known upcoming heresy events. The AI traders also take futures positions, creating adversarial pressure on the curve.
- Margin requirements: the player must lock up obols as collateral, reducing their auction liquidity. This creates a resource tension — do you spend your obols bidding on relics now, or do you bet on the futures curve?

**UI Panel — "MERIT FUTURES":**

```
┌─────────────────────────────────────────────────┐
│ MERIT FUTURES                    DAY 04 / 12    │
├─────────────────────────────────────────────────┤
│ CLASS        SPOT    FWD+3   FWD+5   OPEN INT  │
│ APOSTOLIC    342     358▲    371▲    12 CONT    │
│ MARIAN       289     274▼    261▼     8 CONT    │
│ MARTYR       156     162▲    159─     4 CONT    │
│ PATRISTIC    203     210▲    224▲     6 CONT    │
├─────────────────────────────────────────────────┤
│ YOUR POSITIONS                                  │
│ LONG APOSTOLIC +3   @ 351   MARGIN: 40 OB      │
│ SHORT MARIAN +5     @ 270   MARGIN: 30 OB      │
├─────────────────────────────────────────────────┤
│ [BUY LONG]  [SELL SHORT]  [CLOSE POSITION]      │
└─────────────────────────────────────────────────┘
```

Beneath the table, a miniature sparkline chart per class showing the forward curve as a visual slope — green for contango (upward), red for backwardation (downward).

### Interaction with Existing Systems

- **Heresy events** would cause futures curves to reprice instantly. A heresy targeting Marian relics would crash the Marian forward curve, rewarding anyone holding short positions. The player who reads the heresy event ticker and reacts fastest gets the best entry on the new curve.
- **AI traders** would take futures positions consistent with their archetypes. The Inquisitor would short any class under heresy suspicion. The Pilgrim would go long on whatever class has recent miracle reports. The Merchant Prince would arbitrage spot-vs-forward discrepancies.
- **Portfolio interaction**: futures positions would factor into the player's end-of-session scoring. A player could theoretically win without buying a single relic, purely on futures speculation. This might be interesting or might undermine the core auction loop.

### Assessment

**Strengths:** Historically perfect. The indulgence-as-futures-contract metaphor is airtight. Creates a genuine second axis of speculation beyond the auction. Introduces resource tension (obols for bidding vs. obols for margin).

**Weaknesses:** Abstraction risk is real. The core game is tactile — you bid on named relics, you see your collection. Futures contracts are numbers on numbers. For players who already find trading games opaque, this adds a layer of opacity. The forward curve math, even if simplified, requires the player to understand what contango and backwardation mean in practice. There is also a pacing problem: futures resolve over 3-5 days, but the game's tension is in the moment-to-moment auction. A futures position you took on Day 2 that resolves on Day 7 is background noise during the intervening days.

**Verdict:** Strong expansion concept. Too abstract and slow for the core v1 panel. Better suited as a Day 6+ unlock or a "Pro Mode" layer for experienced players.

---

## 2. Dual Index — Orthodoxy vs. Dissent

### Historical Grounding

The **Great Western Schism** (1378–1417) split Christendom into competing papal courts. Urban VI held Rome; Clement VII held Avignon. For nearly forty years, two (and briefly three) men each claimed to be the sole Vicar of Christ. Nations, monasteries, and trading cities chose sides. The relic market fractured along the same lines — a relic authenticated by the Roman pope was worthless to an Avignon loyalist, and vice versa.

But the broader dynamic predates the Schism. The tension between orthodoxy and dissent was the permanent background radiation of medieval Christianity. The Cathars in the 12th century, the Waldensians, the Fraticelli, the Spiritual Franciscans — every generation produced movements that the Church either absorbed or destroyed. Each wave of dissent threatened the relic economy directly: heretical movements questioned the legitimacy of relics, the authority of the saints, and the very concept of intercessory prayer. When dissent rose, relic prices became volatile. When orthodoxy reasserted itself (usually through Inquisition and crusade), prices stabilized — but not before the power shift created enormous trading opportunities.

The Hussite Wars (1419–1434) are the most dramatic example. Jan Hus's execution in 1415 triggered decades of religiously motivated warfare in Bohemia. Relic markets in Prague collapsed. Relic markets in Rome surged as the papacy doubled down on orthodox authentication. The spread between "safe" and "contested" relics widened enormously.

### Mechanic Design

**A single tug-of-war graph tracking the balance between Orthodoxy and Dissent across the 12-day session.**

The index runs from 0 (total Dissent) to 100 (total Orthodoxy), starting at 50. Events, AI trader behavior, heresy incidents, and player actions push the index in either direction. The index is the game's macro indicator — the equivalent of a fear/greed index or a VIX.

**What moves the index:**

- Heresy events push toward Dissent (index drops).
- Successful Inquisition actions push toward Orthodoxy (index rises).
- AI Pilgrim activity is correlated with Orthodoxy (more Pilgrims appear when index is high).
- AI Friar activity is correlated with Dissent (Friars buy when dissent peaks, anticipating counter-reformation price recovery).
- Player actions can influence the index (see Section 3, Doctrine Deployment).

**Crossover points trigger market events:**

- **Index crosses below 35 — "Dissent Rising"**: Relic authentication becomes uncertain. Random relics in the market are flagged as "Provenance Disputed." Their prices drop, but if Orthodoxy recovers, the dispute is cleared and the relic re-rates upward. Buying disputed relics is a contrarian bet on the index reverting.
- **Index crosses above 75 — "Orthodoxy Ascendant"**: The Church cracks down. Authentication standards tighten. Supply contracts (fewer relics enter the market per day). Prices rise across the board due to scarcity. Good for holders, bad for buyers.
- **Index hits 20 or below — "Schism Event"**: The market splits. Two price columns appear for every relic — "Roman" and "Avignon" (or equivalent). The player must choose which market to trade in. Prices diverge. Arbitrage opportunities emerge but carry the risk of backing the losing side.
- **Index hits 90 or above — "Papal Jubilee"**: A one-day event where all relic prices surge, but a massive new supply enters the market the following day (pilgrims flooding in with relics to sell), creating a boom-bust pattern.

**UI Panel — "FAITH INDEX":**

```
┌─────────────────────────────────────────────────┐
│ FAITH INDEX                      DAY 07 / 12   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ORTHODOXY ██████████████████░░░░░░░░░ DISSENT  │
│                    [ 62 ]                       │
│                                                 │
│  100 ┤                                          │
│   80 ┤          ╭──╮                            │
│   60 ┤───╮  ╭──╯  ╰──●                         │
│   40 ┤   ╰──╯         ▼ TREND: -3/DAY          │
│   20 ┤ ─ ─ ─ ─SCHISM THRESHOLD─ ─ ─ ─          │
│    0 ┤──────────────────────────────            │
│      D1  D2  D3  D4  D5  D6  D7                │
│                                                 │
├─────────────────────────────────────────────────┤
│ ACTIVE EFFECTS:                                 │
│ ● Provenance disputes: NONE                    │
│ ● Supply modifier: NORMAL                      │
│ ● AI Pilgrim activity: ELEVATED (+15%)         │
│ ● Next threshold: DISSENT RISING @ 35          │
└─────────────────────────────────────────────────┘
```

The centerpiece is the historical line chart — a simple time series of the index value over the session. The current value is highlighted with a dot. Threshold lines at 20, 35, 75, and 90 are marked with dashed lines and labeled. Below the chart, a status readout of all active effects derived from the current index level.

### Interaction with Existing Systems

This is the connective tissue mechanic. The dual index ties together heresy events (which push toward Dissent), AI trader behavior (which correlates with the index), and relic pricing (which responds to threshold crossings). It gives the player a single thing to watch that encodes the entire market state. Every other system feeds into or out of the index.

The O-U price model can incorporate the index as a drift modifier: when Orthodoxy is high, mean-reversion targets drift upward (prices trend higher); when Dissent is high, targets drift downward. This creates macro trends that the player can trade around, rather than purely random walks.

### Assessment

**Strengths:** This is the strongest concept in the report. It is a single visual element — a line chart with thresholds — that creates legible trading signals. The player does not need to understand forward curves or exchange rates. They need to watch a line go up or down, notice when it approaches a threshold, and position accordingly. It is historically grounded in the most dramatic economic-religious event of the medieval period. It creates emergent narratives (the session where the Schism triggered on Day 9 and you had to scramble to pick a side). It layers cleanly onto every existing system without replacing any of them.

**Weaknesses:** The threshold events need careful tuning. If the index oscillates too fast, the player gets whiplash. If it moves too slowly, it becomes background decoration. The Schism event (index below 20) is dramatic but potentially confusing — splitting the market into two price columns mid-session is a significant UI and cognitive load spike.

**Verdict:** Core v1 candidate. Build this first. The line chart is the centerpiece of the intelligence panel.

---

## 3. Deploy Doctrine — Propaganda as Market Manipulation

### Historical Grounding

**Papal bulls** were the primary instrument of ideological market manipulation in the medieval period. A papal bull was an official decree, sealed with the pope's lead seal (bulla), that carried the force of divine authority. Bulls could excommunicate kings, authorize crusades, validate or invalidate religious orders, and — critically — authenticate or de-authenticate relics.

The bull *Transiturus de hoc mundo* (1264) established the Feast of Corpus Christi, instantly creating demand for Eucharistic relics. The bull *Exsurge Domine* (1520) condemned Luther's writings and triggered a market panic in Northern European relic markets. Every bull was a market event.

**Excommunication** was economic warfare. An excommunicated ruler could not participate in sacraments, and neither could anyone who traded with them. Excommunication of a city meant its relics lost authentication — their provenance was spiritually contaminated. The 1208 interdict on England under King John shut down Church services nationwide. Relic veneration halted. The economic impact was enormous.

The **mendicant orders** (Franciscans, Dominicans) operated as competing propaganda networks. Dominican preachers promoted relics associated with their order's saints. Franciscan preachers promoted their own. Each order had networks of informants, scribes, and preachers who could shape public opinion — and therefore market sentiment — across entire regions.

### Mechanic Design

**The player spends obols to deploy "doctrines" — one-time-use propaganda cards that manipulate the behavior of AI traders and shift the Orthodoxy/Dissent index.**

Each doctrine has a cost, an effect, and a duration. The player can hold up to 3 doctrines at a time (hand limit) and deploy one per market day. Doctrines are purchased from a rotating market — not all doctrines are available every day.

**Doctrine examples:**

| Doctrine | Cost | Effect | Duration |
|---|---|---|---|
| **Papal Bull: Authentication** | 60 OB | Target one relic class. All relics of that class gain +15% to mean-reversion target. | 3 days |
| **Excommunication** | 80 OB | Target one AI trader. That trader is excluded from the next 2 auctions. | 2 days |
| **Mendicant Preaching** | 40 OB | Attract 1 additional AI Pilgrim to the next auction. Pilgrims bid aggressively but overpay. | 1 day |
| **Heresy Accusation** | 50 OB | Push Orthodoxy/Dissent index 8 points toward Dissent. Target one relic — its provenance becomes "Disputed." | Instant |
| **Jubilee Declaration** | 100 OB | Push index 12 points toward Orthodoxy. All relics gain +10% spot price. Supply increases next day. | 1 day |
| **Inquisition Warrant** | 70 OB | Remove one "Disputed" flag from a relic you own. Push index 5 points toward Orthodoxy. | Instant |
| **Relic Translation** | 45 OB | Change the provenance region of one relic you own (affects which AI traders value it). | Permanent |
| **Interdict** | 90 OB | Suppress all AI trading activity for 1 day. No competing bids. Prices drop due to no demand. | 1 day |

**UI Panel — "DOCTRINE DEPLOYMENT":**

```
┌─────────────────────────────────────────────────┐
│ DOCTRINE DEPLOYMENT              DAY 07 / 12   │
├─────────────────────────────────────────────────┤
│ AVAILABLE DOCTRINES (buy to hand):              │
│                                                 │
│ ┌──────────────────┐ ┌──────────────────┐       │
│ │ EXCOMMUNICATION  │ │ MENDICANT        │       │
│ │ Cost: 80 OB      │ │ PREACHING        │       │
│ │ Ban 1 AI trader  │ │ Cost: 40 OB      │       │
│ │ for 2 auctions   │ │ +1 Pilgrim bidder│       │
│ │ [ACQUIRE]        │ │ [ACQUIRE]        │       │
│ └──────────────────┘ └──────────────────┘       │
│                                                 │
│ YOUR HAND (3/3):                                │
│ ┌────────────┐┌────────────┐┌────────────┐      │
│ │ PAPAL BULL ││ HERESY     ││ INQUISITION│      │
│ │ AUTH.      ││ ACCUSATION ││ WARRANT    │      │
│ │ [DEPLOY]   ││ [DEPLOY]   ││ [DEPLOY]   │      │
│ └────────────┘└────────────┘└────────────┘      │
│                                                 │
│ ACTIVE DOCTRINES:                               │
│ ● Papal Bull (APOSTOLIC +15%) — 2 days left    │
│ ● Excommunication (MERCHANT PRINCE) — 1 day    │
└─────────────────────────────────────────────────┘
```

The panel has three zones: the doctrine market at top (what you can buy), your hand in the middle (what you hold), and active effects at the bottom (what is currently deployed). Each doctrine card is a small bordered box with its name, cost, one-line effect description, and an action button.

### Interaction with Existing Systems

Doctrines are the player's lever for influencing every other system:

- **Orthodoxy/Dissent index**: Heresy Accusation and Jubilee Declaration directly push the index, letting the player engineer threshold crossings.
- **AI traders**: Excommunication removes a competitor. Mendicant Preaching adds a patsy (Pilgrims overpay). Interdict suppresses all AI activity.
- **Relic pricing**: Papal Bull shifts mean-reversion targets. Heresy Accusation creates disputed provenance (price drop). Inquisition Warrant clears disputes (price recovery).
- **Portfolio management**: Relic Translation lets you reposition a relic's provenance to match upcoming demand patterns.

The key design insight: doctrines cost obols, the same resource used for bidding. Every doctrine deployed is an auction you cannot afford to win. This creates constant tension between manipulation (spending obols on doctrines) and acquisition (spending obols on bids). The player who manipulates too aggressively runs out of bidding power. The player who never manipulates is at the mercy of the AI traders and the index.

This is directly analogous to Offworld Trading Company's Hacker Array, where players spend money on black-market sabotage actions (mutiny, power surge, EMP) instead of spending it on production. The Hacker Array is widely considered OTC's best mechanic because it gives the player agency over the market rather than just agency within it.

### Assessment

**Strengths:** Provides the active counterpart to the Dual Index's passive intelligence. Creates meaningful resource tension with the auction system. Each doctrine is a discrete, legible action with a clear outcome — no abstraction problem. The card-hand metaphor is intuitive. Historically rich (every doctrine maps to a real medieval instrument of power). Creates emergent combos (deploy Heresy Accusation to crash a relic's price, buy it cheap, then deploy Inquisition Warrant to clear the dispute and profit from the recovery).

**Weaknesses:** Balance is critical. If doctrines are too cheap, the player manipulates constantly and the AI traders become irrelevant. If they are too expensive, the player never uses them. The rotating doctrine market adds randomness — a player who never sees Excommunication has a different experience than one who sees it on Day 1. The hand limit (3) needs to feel constraining but not punitive.

**Verdict:** Core v1 candidate. Build this alongside the Dual Index. Together they form the complete intelligence panel: observe (index), then act (doctrine).

---

## 4. Currency Markets — The Obol and Medieval Exchange Rates

### Historical Grounding

The **obol** has deep thematic resonance. In Greek mythology, it was the coin placed in the mouth of the dead to pay Charon for passage across the River Styx. The practice persisted into the Christian medieval period — coins have been found in the mouths of medieval burials across Europe. The word itself comes from the Greek *obolos*, a small silver coin worth one-sixth of a drachma. Using "obol" as the game's base currency is already a statement: you are trading in the currency of the dead.

Medieval Europe had no unified currency. The major trading coins were:

- **Venetian ducat** (gold, minted from 1284): The dollar of the Mediterranean. Standard for international trade. Venice's dominance in the Eastern Mediterranean relic trade meant ducats were the preferred currency for Byzantine and Holy Land relics.
- **Florentine florin** (gold, minted from 1252): The ducat's rival. Florence's banking families (Bardi, Peruzzi, Medici) dominated Western European finance. Italian relics and papal-authenticated relics were priced in florins.
- **Byzantine bezant** (gold, the hyperpyron after 1092): The ancient standard, debased and declining. Eastern Orthodox relics — icons, fragments from Constantinople's enormous relic collections — were originally priced in bezants. After the Fourth Crusade's sack of Constantinople (1204), looted Byzantine relics flooded Western markets, priced in whatever currency the looter preferred.
- **Livre tournois** (silver, French): The standard for Northern European transactions. French relics, Avignon-authenticated relics, and relics associated with the Capetian dynasty traded in livres.

Exchange rates between these currencies fluctuated based on bullion supply, trade balances, military events, and — crucially — the relative prestige of the institutions that backed them. When the papacy moved to Avignon (1309), the livre strengthened against the florin. When Constantinople fell (1453), the bezant collapsed entirely.

### Mechanic Design

**Each relic has a provenance region that determines its base pricing currency. The player trades in obols but must convert to the appropriate currency to buy or sell relics from different regions.**

- Byzantine relics are priced in bezants.
- Italian relics in florins.
- French relics in livres.
- Relics from the Holy Land in ducats.

Exchange rates fluctuate daily based on game events. A heresy event in France weakens the livre. A crusade announcement strengthens the ducat. The Orthodoxy/Dissent index affects all exchange rates (high Orthodoxy strengthens the florin, the papal currency; high Dissent weakens it).

**UI Panel — "CAMBIUM" (medieval term for currency exchange):**

```
┌─────────────────────────────────────────────────┐
│ CAMBIUM — EXCHANGE RATES         DAY 07 / 12   │
├─────────────────────────────────────────────────┤
│ PAIR           RATE      CHG     7D CHART       │
│ OB/DUCAT       4.20     +0.15▲  ╭─╮ ╭──●       │
│ OB/FLORIN      3.85     -0.08▼  ──╯╰─╯         │
│ OB/LIVRE       2.60     +0.02─  ─────────●      │
│ OB/BEZANT      1.90     -0.22▼  ╮  ╭╮          │
│                                  ╰──╯╰──●       │
├─────────────────────────────────────────────────┤
│ CONVERSION CALCULATOR                           │
│ [___] OB  →  DUCAT  =  [___]   [CONVERT]       │
├─────────────────────────────────────────────────┤
│ CURRENCY EXPOSURE:                              │
│ DUCAT: 340 (4 relics)  FLORIN: 180 (2 relics)  │
│ LIVRE: 0 (0 relics)    BEZANT: 95 (1 relic)    │
└─────────────────────────────────────────────────┘
```

Sparkline charts per currency pair. A conversion calculator for quick math. A currency exposure readout showing how much value the player holds in each currency.

### Assessment

**Strengths:** Historically rich. Creates an additional speculation axis (currency trading on top of relic trading). The provenance-currency link adds flavor and forces the player to think about regional dynamics. The exchange rate fluctuations create arbitrage opportunities (buy a French relic when the livre is weak, sell when it strengthens).

**Weaknesses:** This is a full forex system bolted onto a relic trading game. The cognitive overhead is substantial. The player now needs to track relic prices AND exchange rates AND the interaction between them. Currency conversion introduces friction that may feel like busywork rather than strategic depth. The UI panel is information-dense but not action-dense — the player watches numbers move but does not make many discrete decisions. Most critically, it competes with the auction for the player's attention without enhancing the auction. The Dual Index enhances auction decisions (buy when the index suggests a recovery). Currency markets complicate auction decisions (buy this relic, but first calculate the exchange rate, and also consider whether the rate will move before you sell).

**Verdict:** Too complex for core v1. The provenance-currency link is flavorful and could work as an expansion layer — perhaps unlocked in a second playthrough or as a "Hard Mode" modifier. The Cambium panel is visually satisfying and thematically on-point, so it is worth building eventually. But it should not compete with the Dual Index for the primary intelligence panel slot.

---

## 5. Additional Concepts

### 5.1 Pilgrimage Route Map — Demand Indicator

**Historical basis:** Pilgrimage routes (the Camino de Santiago, the Via Francigena to Rome, the routes to Canterbury and Jerusalem) were the demand arteries of the relic economy. A saint whose shrine sat on a major route had guaranteed foot traffic. A relic relocated to a cathedral on a busy route was worth more than the same relic in a backwater monastery.

**Mechanic:** A stylized network graph showing 4-5 pilgrimage routes. Each route "lights up" based on current AI Pilgrim activity and random events (a miracle report on the Camino increases traffic there). Relics associated with lit-up routes gain a demand bonus. The map is a leading indicator — routes light up 1-2 days before the demand effect hits prices.

**UI:** A dark-background node graph with routes as connecting lines. Active routes pulse in amber. Inactive routes are dim gray. Node labels show key cities (Rome, Santiago, Canterbury, Jerusalem, Avignon).

```
┌─────────────────────────────────────────────────┐
│ PILGRIMAGE ROUTES                DAY 07 / 12   │
├─────────────────────────────────────────────────┤
│                                                 │
│   Canterbury ○─ ─ ─ ─○ Cologne                 │
│       │                  │                      │
│       ○ Paris ───────○ Basel                    │
│       │                  │                      │
│   Santiago ○── ── ──○ ROME ●━━━━● Jerusalem     │
│                      (ACTIVE)    (SURGING)      │
│                                                 │
│ ACTIVE: Via Francigena (+12% Italian relics)    │
│ SURGING: Holy Land routes (+20% Apostolic)      │
│ DORMANT: Camino, Northern routes                │
└─────────────────────────────────────────────────┘
```

**Verdict:** Elegant leading indicator. Low implementation complexity — it is essentially a themed demand modifier with a visual wrapper. Strong candidate for inclusion alongside the Dual Index as a secondary panel. Does not require new mechanics, just a new visualization of existing demand data.

### 5.2 Papal Favor Index

**Historical basis:** The pope's favor was the ultimate market force. A saint canonized by the current pope saw relic prices surge. A religious order that fell out of favor saw its associated relics depreciate. Papal favor was fickle, political, and enormously consequential.

**Mechanic:** A simple 0-100 gauge representing the player's standing with the papal court. High favor grants access to premium relics, lower authentication costs, and bonus pricing on sales. Low favor means higher transaction costs and risk of excommunication (which locks you out of the market for 1 day). Favor is gained by trading in orthodox relics and deploying pro-Orthodoxy doctrines. Favor is lost by trading in disputed relics or deploying dissent-aligned doctrines.

**Verdict:** Interesting but overlaps with the Orthodoxy/Dissent index. If the Dual Index is implemented, Papal Favor becomes redundant — it is just the index viewed from a personal rather than market perspective. Could work as a character-level modifier (your personal standing vs. the market's macro state), but adds complexity without proportional depth. Skip for v1. Revisit if the game adds persistent progression across sessions.

### 5.3 Miracle Verification Tracker

**Historical basis:** Miracles were the proof-of-work of the relic economy. A relic that produced verified miracles (healings, visions, incorruptibility of the saint's body) was worth exponentially more than an unverified one. The Church maintained formal miracle investigation processes — *processus canonizationis* — that could take years. But rumors of miracles moved markets immediately.

**Mechanic:** A ticker-style feed showing miracle reports in various stages of verification: RUMOR → INVESTIGATION → VERIFIED or DEBUNKED. Relics associated with saints currently under miracle investigation get a speculation premium. Verification triggers a price surge. Debunking triggers a crash.

**UI:** A scrolling ticker at the bottom of the screen, styled like a Bloomberg news feed.

```
┌─────────────────────────────────────────────────┐
│ MIRACLE VERIFICATION TRACKER                    │
├─────────────────────────────────────────────────┤
│ ● St. Ambrose — Healing at Milan — RUMOR        │
│   ↳ Apostolic relics speculative premium: +8%   │
│ ● St. Helena — Weeping Icon, Ravenna — INVEST.  │
│   ↳ Investigation Day 2/4. Outcome: Day 09      │
│ ● St. Brendan — Navigation miracle — DEBUNKED   │
│   ↳ Celtic relics correction: -12%              │
└─────────────────────────────────────────────────┘
```

**Verdict:** Excellent flavor mechanic. Low complexity — it is a themed event feed with price modifiers attached. The RUMOR → INVESTIGATION → OUTCOME pipeline creates a multi-day speculation arc that gives the player something to anticipate and position around. Strong candidate for v1 as a news ticker component, not a full panel.

### 5.4 Indulgence Pricing Panel

**Historical basis:** Indulgences and relics were substitute goods. When indulgences were cheap and plentiful (as during Tetzel's 1517 campaign), demand for relics softened — why pay for a bone fragment when you can buy a printed indulgence letter for a fraction of the price? When indulgences were restricted or discredited, relic demand surged as the only remaining avenue for spiritual insurance.

**Mechanic:** An indulgence price index that moves inversely to relic demand. When indulgences are cheap, relic prices face downward pressure. When indulgences are expensive or scarce, relic prices rise. The player cannot buy or sell indulgences (that would make this a second trading game) — the index is purely informational, a macro indicator like the VIX.

**Verdict:** Smart concept, but functionally redundant if the Dual Index is implemented. High Orthodoxy already implies a strong institutional Church, which implies plentiful indulgences, which implies price pressure on relics. The causal chain is there; adding a separate indulgence panel just makes the causation explicit at the cost of panel real estate. Could be folded into the Dual Index as a sub-indicator (a small "Indulgence Supply" readout within the Faith Index panel). Not a standalone panel.

### 5.5 Schism Risk Meter

**Historical basis:** The Great Schism of 1054 (East-West), the Western Schism of 1378, and the various anti-papal movements all had precursor signals — theological disputes, political conflicts, rival claimants. The Schism was never a surprise to those paying attention.

**Mechanic:** A volatility indicator that tracks the probability of a Schism Event (the most extreme outcome of the Dual Index dropping below 20). It aggregates: current index level, rate of index change, number of active heresy events, and AI trader sentiment. The meter rises as conditions deteriorate.

**Verdict:** This is a derivative of the Dual Index — literally a function of the index's level and velocity. If the Dual Index chart is well-designed (showing trend lines and threshold proximity), the Schism Risk Meter is redundant. The player can see the risk by reading the chart. Adding a separate meter is hand-holding. Skip it; trust the player to read the graph.

### 5.6 Reliquary Insurance Market

**Historical basis:** Medieval merchants insured cargo against loss at sea, theft, and fire. The Venetian and Genoese developed early marine insurance contracts. Relics, as high-value portable goods, were prime candidates for insurance — especially relics being transported between cities (relic translations were major events with substantial theft risk).

**Mechanic:** The player can purchase insurance contracts on relics in their portfolio. Insurance pays out if a heresy event, Schism, or dispute causes a relic's value to drop below the insured amount. Insurance costs scale with the relic's risk profile (relics associated with currently declining saint classes cost more to insure).

**Verdict:** Thematically delightful but mechanically marginal. Insurance is a risk mitigation tool in a game where risk-taking is the point. A player who insures their entire portfolio is playing not to lose, which is antithetical to the speculative energy of the game. Could work as a late-game option for protecting a winning portfolio in the final 2-3 days, but as a full panel it is too conservative. File for potential expansion.

---

## 6. Comparative Analysis and Recommendation

### Ranking Matrix

| Concept | Gameplay Depth | Thematic Fit | UI Clarity | Implementation Complexity | Overall |
|---|---|---|---|---|---|
| **Dual Index (Orthodoxy/Dissent)** | ★★★★★ | ★★★★★ | ★★★★★ | ★★★☆☆ (moderate) | **#1** |
| **Doctrine Deployment** | ★★★★★ | ★★★★★ | ★★★★☆ | ★★★☆☆ (moderate) | **#2** |
| **Miracle Verification Tracker** | ★★★☆☆ | ★★★★★ | ★★★★★ | ★★☆☆☆ (low) | **#3** |
| **Pilgrimage Route Map** | ★★★☆☆ | ★★★★☆ | ★★★★☆ | ★★☆☆☆ (low) | **#4** |
| **Souls Futures Market** | ★★★★★ | ★★★★★ | ★★★☆☆ | ★★★★☆ (high) | **#5** |
| **Currency Markets** | ★★★★☆ | ★★★★★ | ★★★☆☆ | ★★★★★ (very high) | **#6** |
| **Reliquary Insurance** | ★★☆☆☆ | ★★★★☆ | ★★★★☆ | ★★★☆☆ (moderate) | **#7** |
| **Papal Favor Index** | ★★☆☆☆ | ★★★★☆ | ★★★★★ | ★★☆☆☆ (low) | **#8** |
| **Indulgence Pricing Panel** | ★★☆☆☆ | ★★★★★ | ★★★★★ | ★☆☆☆☆ (trivial) | **#9** |
| **Schism Risk Meter** | ★☆☆☆☆ | ★★★★☆ | ★★★★★ | ★☆☆☆☆ (trivial) | **#10** |

### Recommendation: Dual Index + Doctrine Deployment

The v1 intelligence panel should consist of two components:

**1. The Faith Index (Dual Index)** — the passive intelligence layer. A single line chart tracking Orthodoxy vs. Dissent across the 12-day session, with threshold crossings that trigger market events. This is the panel the player watches. It encodes the macro state of the game into a single, readable visual. It answers the question: "What is happening in the market?" The player reads the index, identifies the trend, notes proximity to thresholds, and forms a trading thesis. This is the Bloomberg terminal's core promise: dense information, legibly presented, demanding interpretation.

**2. Doctrine Deployment** — the active manipulation layer. A card-based system where the player spends obols to deploy papal bulls, excommunications, heresy accusations, and other instruments of medieval information warfare. Each doctrine has a direct, legible effect on the market — push the index, exclude a trader, dispute a relic's provenance. This is the panel the player acts through. It answers the question: "What can I do about the market?"

Together, these two panels form a complete **observe-then-act loop**:

1. Read the Faith Index. The index is trending toward Dissent. It is at 38 and falling. The Dissent Rising threshold is at 35. If it crosses, random relics will have their provenance disputed, crashing their prices.
2. The player has two choices:
   - **Play the trend:** Let the index fall. Buy disputed relics cheap. Then deploy a Jubilee Declaration to push the index back toward Orthodoxy. When the disputes clear, sell the relics at recovered prices. This is a contrarian manipulation play.
   - **Fight the trend:** Deploy an Inquisition Warrant to push the index back up before it crosses 35. Protect your existing portfolio from dispute risk. This is a defensive play that costs obols you could have used to bid.
3. Either way, the player is making a meaningful decision that combines reading the market state with taking an action. The auction is no longer the only thing happening. The player is a relic broker AND a political operator.

This pairing also has the best thematic coherence. The medieval relic market was not a free market — it was a market shaped by institutional power. Popes, bishops, inquisitors, and mendicant orders constantly manipulated supply, demand, authentication, and sentiment. A relic broker who did not engage with the political dimension was not a serious player. The Dual Index and Doctrine Deployment capture this reality: you cannot just trade relics, you must also trade influence.

### Implementation Sequence

1. **Phase 1 — Faith Index:** Implement the Orthodoxy/Dissent index as a background variable. Connect it to heresy events (push toward Dissent) and existing AI behavior (Inquisitor pushes toward Orthodoxy). Add the line chart panel. Add threshold events at 35 and 75. Do not implement the Schism event (index below 20) in Phase 1 — it is a complexity spike that can wait.

2. **Phase 2 — Doctrine Deployment:** Implement 4-5 core doctrines (Papal Bull, Excommunication, Heresy Accusation, Mendicant Preaching, Jubilee Declaration). Add the card hand UI. Connect doctrine effects to the Faith Index and AI behavior. Tune obol costs against auction prices.

3. **Phase 3 — Polish and Extend:** Add the Miracle Verification Tracker as a news ticker (low effort, high flavor). Consider the Pilgrimage Route Map as a secondary panel if screen real estate allows. Tune threshold events based on playtesting. Consider adding the Schism event as a rare, late-session dramatic moment.

4. **Phase 4 (Expansion) — Advanced Markets:** Souls Futures as a Pro Mode unlock. Currency Markets as a Hard Mode modifier. Reliquary Insurance as a late-game option.

### Final Note

The design goal is not to simulate a medieval financial market with full fidelity. It is to give the player the *feeling* of operating inside a market shaped by forces larger than themselves — forces they can read, anticipate, and occasionally manipulate, but never fully control. The Faith Index provides the reading. Doctrine Deployment provides the manipulation. The auction provides the trading. Together, they make HOLY_OPS.EXE a game about power, information, and sacred bones.

---

*End of research report.*

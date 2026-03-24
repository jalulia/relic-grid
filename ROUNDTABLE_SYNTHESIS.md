# HOLY_OPS.EXE — Roundtable Synthesis

## Five Experts, One Clandestine Relic Exchange

**Participants:**
- **THE TERMINAL DESIGNER** — Bloomberg terminal UX specialist, information density evangelist
- **THE ECONOMIST** — Game economy designer, price model architect
- **THE ART HISTORIAN** — Auction house consultant, medieval ecclesiastical objects
- **THE DARK HISTORIAN** — Researcher in medieval relic politics, fraud, and heretical movements
- **THE GAME DESIGNER** — Systems designer, core loop architect

---

## PART 1: WHERE THE EXPERTS AGREE

Across five independent research reports, written from five different disciplinary perspectives, these points of consensus emerged. None of these were coordinated. When a Bloomberg terminal specialist and a medieval art historian independently arrive at the same conclusion, it is probably correct.

### 1. The Sell Side Is the Game

Every single report identifies the same structural problem with the current design: currency flows in one direction. The Terminal Designer calls it a "spend-down auction." The Game Designer maps it explicitly: "Currency depletes linearly -> Game over." The Economist puts a number on it: starting capital should be 2,000 (not 5,000), precisely because the player needs to *feel* the pressure to trade their way up. The Art Historian frames it through real auction mechanics: the buy side is only half the market.

The consensus is total: the game does not become a trading game until relics can be sold. Everything else is secondary to implementing the sell mechanic.

### 2. Relics Must Have Fluctuating Market Value

All five reports converge on the idea that relics need dynamic pricing independent of what the player paid at auction. The Economist proposes a specific mathematical model (Ornstein-Uhlenbeck mean-reverting process). The Terminal Designer wants sparklines showing price history. The Art Historian grounds it in reality: relic values historically fluctuated based on miracle reports, political backing, and competing claims. The Dark Historian provides the historical supply shocks (the Fourth Crusade flood, the Reformation destructions) that prove the real market was wildly volatile. The Game Designer ties it to player skill: price discovery should be something the player learns, not something the game tells them.

This is the foundation everything else sits on. Without fluctuating prices, there is no spread. Without a spread, there is no trading.

### 3. The Terminal Feed Is Not Decoration — It Is the Primary Skill Surface

Every report identifies the terminal feed as the game's most underutilized asset. The Game Designer is most explicit: "The terminal is not decoration. The terminal feed contains actionable intelligence." The Terminal Designer wants market transactions interspersed with heresy reports. The Economist designs a system where heresy events leak upcoming demand shifts 10-15 seconds before they hit. The Dark Historian provides the historical content that makes the feed feel real: papal decrees, forgery scandals, Crusade spoils arriving.

The agreement is that the player who reads the feed should trade better than the player who ignores it. Attention allocation is the core skill. This is the same design principle that makes Bloomberg terminals compelling: every line of scrolling text is potentially actionable.

### 4. The Heresy System Should Drive the Economy, Not Just Pause It

Currently, heresy events freeze AI bidding for 4 seconds. All five reports agree this is a good start but dramatically undersells the mechanic's potential. The Economist maps each sect to specific saints with differentiated price effects (Cathari depress Catherine and Teresa; Flagellants spike Sebastian and Francis). The Dark Historian provides the historical justification: the Cathars rejected material relics entirely (market-wide depression), while the Waldensians specifically targeted commercialization of the sacred (high-value lots disrupted), and the Flagellants introduced their own counterfeit relics (supply confusion). The Game Designer wants heresy-driven price windows as the game's primary learnable pattern. The Art Historian notes that real market disruptions (the Reformation, the Fourth Crusade) had exactly this structure: external shocks creating buying opportunities for informed players.

The consensus: heresy events should be the game's equivalent of earnings reports in stock trading. They move the market. The skilled player reads the sect name and instantly knows which saints are affected.

### 5. AI Bidders Need Personalities

All reports that discuss AI behavior agree: the current uniform AI bidder is insufficient. The Art Historian proposes archetypes drawn from real auction behavior (the institutional buyer, the phone bidder who enters late, the zealot who overpays). The Economist designs six distinct archetypes (Devotee, Speculator, Hoarder, Liquidator, Authenticator, Cartel) with specific behavioral patterns the player can learn. The Game Designer wants visible AI collectors pursuing specific saints, creating rivalry narratives. The Terminal Designer wants AI behavior surfaced in the feed.

The key insight that unites these proposals: AI personalities create information asymmetry. A player who has learned that "Brother Augustine is a Devotee collecting Teresa" can exploit that knowledge. This is the same dynamic that makes poker interesting: reading your opponents.

### 6. The Completion Premium Is Real and Should Be Brutal

The Art Historian calls it "the tyranny of the last lot." The Economist models it mathematically: a 6x multiplier at 95% completion. The Game Designer builds the entire late-game around it: rival AI collectors drive up prices for the final pieces. The Dark Historian provides the historical parallel: medieval institutions were desperate to complete their saint's relic set because completeness meant exclusive pilgrimage rights.

Everyone agrees: the last 2-3 relics of any saint should be dramatically more expensive than the first 2-3. This creates the game's central strategic tension. It is expensive to finish what you start.

### 7. Net Worth, Not Cash, Is the Score

The Terminal Designer proposes a prominent net worth ticker (cash + portfolio value). The Economist designs the entire economy around portfolio management. The Game Designer makes net worth the tiebreaker in the scoring system. The Art Historian frames it through real collecting: a collector's wealth is in their holdings, not their bank account.

The current game shows "currency remaining." The new game should show net worth, and it should fluctuate visibly as market prices change. Watching your net worth tick upward is inherently compelling. Watching it drop is inherently motivating.

### 8. Color Is Information

The Terminal Designer codifies it: green means up/profit, red means down/loss, gold means currency/your positions, cyan means market data. The Game Designer echoes it: the player should be able to read the market by color without parsing numbers. The Economist wants green and red P&L numbers in the portfolio view.

This seems obvious, but the unanimity matters. The game already has a strong color system. The trading pivot should not introduce new color semantics. It should extend the existing ones.

---

## PART 2: WHERE THE EXPERTS DISAGREE

These are the genuine tensions. In each case, both sides have strong arguments. Resolving these debates is the core design challenge.

### Debate 1: Real-Time vs. Phased Pacing

**The Game Designer argues for market phases.** The proposal is structured: 15-second Briefing, 3-minute Open Market, 30-second Closing Bell, untimed Settlement. The argument is that trading requires analysis time, and pure real-time denies the player space to think. The Slay the Spire comparison is explicit: combat has urgency, but deck management between fights is contemplative.

**The Terminal Designer argues for continuous real-time.** The Bloomberg aesthetic demands liveness. The proposed rhythm — frantic buying, deliberate selling — already creates two tempos without imposing artificial phases. The argument: phases break the fiction. A terminal does not have "market hours" in a 25-minute game session.

**The Economist is implicitly on the real-time side.** The Ornstein-Uhlenbeck model updates every 5 seconds, continuously. The trade cycle (45 seconds to 3 minutes) fits naturally into real-time flow. The sell-side recommendation (instant sell at market price for v1) assumes the player can sell at any moment, not just during Settlement.

**What is at stake:** If the game has phases, it becomes more strategic and more accessible, but potentially loses energy and the terminal-as-living-market feeling. If it stays real-time, it keeps its energy but risks overwhelming players who need to think about sell decisions. The compromise is probably the Game Designer's suggestion of an optional portfolio view that the player can open at any time — a self-imposed pause within continuous real-time.

### Debate 2: How Complex Should the Economy Be?

**The Economist wants depth.** The Ornstein-Uhlenbeck price model, six AI archetypes, margin trading, provenance decay at 1.5% per minute, adaptive speculator delay that shrinks as the player succeeds. The argument: sophisticated systems create a skill ceiling high enough to sustain long-term play.

**The Game Designer wants legibility.** Three rules for avoiding spreadsheet creep: color is information, progressive disclosure, the terminal tells stories not data. The Game Designer explicitly warns against "Bloomberg-terminal alienation." Instead of showing raw price change percentages, the terminal should narrate them.

**The Art Historian adds complexity but in a different dimension.** The proposed relic quality stack (saint fame, body part rank, provenance depth, provenance quality, authentication status, condition, reliquary quality) creates eight independent axes of value. This is enormous informational complexity — but it is the kind of complexity that real auction house specialists manage through intuition, not spreadsheets.

**What is at stake:** The Economist's system is elegant and mathematically sound, but it may require the player to internalize too many interacting systems. The Game Designer's simpler model loses some of the Economist's precision but keeps the game playable in 25-minute sessions. The resolution is probably progressive depth: start with simple pricing (relic class determines broad value range), then layer in the Economist's more sophisticated models as the player demonstrates mastery.

### Debate 3: Single Currency vs. Multiple Economic Layers

**The Economist is emphatic: single currency.** The argument from experience is direct: multiple currencies in a single-player game create confusion, not depth. However, the Economist then proposes margin trading (borrow at 3% per minute) and provenance certificates — which are, functionally, secondary economic layers.

**The Art Historian implicitly argues for multiple value dimensions** through the relic quality stack. A relic's "price" is not just one number — it is the product of eight attributes. This creates something richer than a multi-currency system: a multi-axis valuation space where two relics at the same price can have completely different investment profiles.

**The Game Designer proposes a functional dual currency** through the enshrine mechanic. Enshrined relics are a non-liquid asset class. Cash and enshrined relics are fundamentally different forms of wealth. This creates the trading-vs-collecting tension without adding explicit currency complexity.

**What is at stake:** The Economist is right that explicit multi-currency systems fail in session-based single-player games. But the Art Historian and Game Designer are right that the game needs multiple dimensions of value. The resolution is the Economist's approach: one currency (the Obol), but with relics themselves as a second implicit asset class with complex, multi-dimensional valuation.

### Debate 4: How Central Should Forgery/Authentication Be?

**The Art Historian and Dark Historian both want forgery to be a major mechanic.** The Art Historian proposes an authentication gambling system (VERIFIED = 95% genuine, UNVERIFIED = 40%) with ongoing forgery reveal risk. The Dark Historian argues that fraud was the fundamental reality of the medieval relic trade and that authenticity should be "a spectrum, not a binary."

**The Game Designer barely mentions forgery.** The entire 546-line report contains no forgery mechanic. The core loop is buy-hold-sell-enshrine, with authentication playing no role. The implicit argument: forgery adds randomness that undermines the skill-based trading loop. If the player makes a good trade and then the relic turns out to be fake, the loss feels arbitrary rather than educational.

**The Economist proposes a middle ground**: the Authenticator AI archetype, which periodically verifies or denounces relics, changing their value by 20-40%. This preserves authentication as a market-moving event without making it a random tax on the player's portfolio.

**What is at stake:** Forgery creates emotional moments (the reveal, the gamble) but risks undermining the trading skill loop. The key question is whether forgery is a system the player can learn to evaluate (making it a skill) or a random punishment (making it frustrating). The historians argue the former; the absence of forgery from the game design report implicitly argues the latter. The Economist's Authenticator model threads the needle: authentication events are market signals, not personal losses.

### Debate 5: Inventory Limits and Holding Costs

**The Economist wants both.** A 12-15 relic inventory cap plus provenance decay (1.5% per minute, floor at 70%). The argument: inventory limits force interesting decisions, and holding costs prevent passive hoarding.

**The Game Designer proposes no inventory limit** but uses the enshrine mechanic as the constraint. Every relic you hold is capital you are not deploying elsewhere. The opportunity cost is the holding cost. Explicit depreciation is unnecessary because time pressure (12 market days) already punishes idle holdings.

**The Terminal Designer's portfolio view** does not mention inventory limits. The Bloomberg analogy suggests unlimited positions: real traders can hold as many positions as they can afford.

**What is at stake:** Inventory limits create "inventory Tetris" decisions (the Economist's Diablo comparison). But they also create frustration when the player cannot buy an underpriced relic because their slots are full. Provenance decay is elegant (thematic, not arbitrary), but the 1.5% per minute rate means a relic held for 10 minutes loses 15% of its value — this may be too aggressive for relics the player is holding for saint completion. The resolution probably involves softer constraints: no hard inventory limit, but gentle depreciation that only kicks in after a threshold (say, after 5 minutes of holding).

### Debate 6: Starting Capital and Difficulty

**The Economist wants 2,000.** The argument: low starting capital forces the player to trade from the beginning. At 2,000, completing Teresa requires doubling your money. This creates immediate pressure and makes early trading decisions meaningful.

**The Game Designer wants 500.** Even more aggressive. The player starts with almost nothing and a single Class III relic worth about 60 credits. The argument: extreme scarcity in the early game creates clear decision-making (you can only afford one or two trades at a time) and makes the first profitable trade feel transformative.

**The current game starts at 5,000.** Both proposals represent dramatic reductions — by 60% and 90% respectively.

**What is at stake:** Lower starting capital means more trading pressure but also more early-game frustration. A player who makes two bad trades at 500 starting capital is essentially bankrupt. At 2,000, they have more runway to learn. The Game Designer counters with rubber-banding (the Papal Subsidy at 100 credits), which prevents total lockout. The Economist counters with a generous early game (40% reduced volatility, 30% tighter spreads). Both solutions work, but they create very different opening experiences.

### Debate 7: The Role of the Heresy System in the New Design

**The Dark Historian wants maximally differentiated heresy effects.** Each sect should disrupt the market differently: Cathars crash everything, Waldensians target high-end lots, Lollards expose fakes, Flagellants introduce counterfeits, Hussites destroy supply. The argument is historical fidelity and mechanical richness.

**The Economist agrees on differentiation** but maps it to simpler effects: price changes per saint per sect, with clear cause-effect. The Flagellants spike Sebastian prices; the Cathari dip Catherine prices. Clean, learnable, predictable.

**The Game Designer treats heresy as one signal among many** in the terminal feed. It is important but not dominant. Demand events, AI collector intelligence, and market summaries share space with heresy reports.

**What is at stake:** If heresy effects are too differentiated and complex, the player must memorize a large mapping table (5+ sects x 8 saints x different effect types). If they are too simple (all heresies depress all prices), the system loses strategic depth. The Economist's middle ground — fixed sect-to-saint mappings with consistent directional effects — is probably right. The Dark Historian's more exotic effects (Flagellant counterfeits, Lollard authentication crises) could be reserved for advanced difficulty or late-game escalation.

---

## PART 3: THE SURPRISING CONNECTIONS

When you put a Bloomberg terminal designer, an economist, an art historian, a historian of heresy, and a game designer in the same room, unexpected things happen. These cross-domain insights are the roundtable's most valuable output.

### Connection 1: The Art Historian's Provenance Chain Solves the Economist's Opacity Problem

The Economist identifies a critical failure mode: "Player feels cheated — the player makes a 'correct' decision and still loses money." The solution proposed is transparency: every price movement needs a visible cause. But causes like "Ornstein-Uhlenbeck mean reversion" or "sigma noise term" are opaque even when shown.

The Art Historian provides the solution without knowing it. Provenance chains — the multi-link custody histories of each relic — are a narrative form of price justification. A relic is not expensive because of a mathematical formula. It is expensive because it passed through the Imperial Chapel in Constantinople, survived the Fourth Crusade, resided in Cardinal Orsini's collection, and ended up at the Abbey of Cluny. Each link in the chain is a story that justifies a price premium.

When the Economist's model causes a price to spike, the terminal feed can explain it in provenance terms: "Newly authenticated link to Papal Treasury — AMBROSE Third Metacarpal revalued." The numbers move because of math. The player understands it because of story.

### Connection 2: The Dark Historian's Heretical Sects Map Perfectly onto the Economist's Sector Rotation Model

The Economist needs a mechanism for "sector rotation" — different parts of the relic market becoming cheap and expensive in cycles, creating windows for informed buying and selling. The mechanism proposed is heresy events affecting saint-specific prices.

The Dark Historian, independently, provides the exact justification for which sects affect which saints and *why*. The Cathars rejected material relics, so they crash the whole market. The Waldensians targeted commercialized religion, so they hit expensive lots. The Bogomils rejected the cross specifically, so they target Passion relics. The Flagellants created their own counterfeit relics, so they introduce supply confusion.

This is not arbitrary flavor text. It is historically grounded cause-and-effect that creates a learnable system. The player who reads the Dark Historian's logic can predict the market impact of each sect's heresy event — which is exactly what the Economist needs for skill-based trading.

### Connection 3: The Terminal Designer's "Launchpad" Model Enables the Game Designer's Phase Transitions

The Game Designer's biggest challenge is the real-time vs. phased pacing debate. The Terminal Designer offers a structural solution borrowed from Bloomberg: the Launchpad model, where users create custom multi-panel layouts and toggle between views. A "market view" that maximizes the grid. A "portfolio view" that maximizes collection tracking. A "sniper view" that shows only lots about to expire.

This solves the pacing problem without imposing artificial phases. During high-intensity moments, the player is in market view (the current experience). When they want to think strategically, they toggle to portfolio view. The phase transition is player-initiated, not system-imposed. The game stays real-time throughout, but the player controls their own tempo by choosing what information to foreground.

### Connection 4: The Art Historian's "Bought-In Lots" Create the Game Designer's Urgency Without Time Pressure

The Game Designer identifies a design principle: "selling decisions should NOT be time-pressured. The sell side should be contemplative." But the game still needs urgency on the buy side to prevent analysis paralysis.

The Art Historian provides a mechanism from real auction practice: reserve prices and bought-in lots. If nobody bids enough, the lot is withdrawn. The player does not lose to a rival — they lose to the floor. This creates urgency ("I might lose this piece entirely") without frantic time pressure ("I must click faster than the AI"). It is a cognitive urgency, not a mechanical one. And it is historically authentic: 20-30% of lots at major auction houses fail to sell.

### Connection 5: The Dark Historian's Emotional Dimension Validates the Game Designer's "Enshrine Should Feel Expensive"

The Game Designer proposes that enshrining a relic (permanently locking it into the collection) should feel like a sacrifice — a visual transition from bright and tradeable to dim and permanent. But the justification is purely mechanical (it reduces your trading capital).

The Dark Historian provides the emotional depth. Medieval people experienced relic acquisition as a genuine encounter with a living spiritual presence. Pilgrims wept. The act of placing a relic in its permanent shrine was a moment of solemnity. The terror of desecration — of losing a relic — was comparable to witnessing murder.

This suggests that the enshrine animation should not just show a mechanical lock icon. It should evoke placement in a reliquary. The relic moves from a trading card to a sacred object. The sound should be stone sliding into place. The visual should dim and sanctify. The emotional register shifts from commerce to devotion. This is what makes the game more than a spreadsheet: the tension between the sacred and the commercial is not just a mechanic. It is the game's emotional core.

### Connection 6: The Economist's "Cornering a Saint" Is the Art Historian's "Getty vs. Norton Simon"

The Economist proposes market manipulation: the player buys up a majority of one saint's relics, causing the remaining ones to spike in price via the completion premium. The Economist frames this as a "high-risk, high-capital strategy" with opportunity cost as the balancing mechanism.

The Art Historian, independently, describes exactly this dynamic from real auction history — the rivalry between collectors who both want the same thing, driving prices to unprecedented levels. When two institutions both need the same medieval ivory, the sky is the limit. The Art Historian also provides the counter-strategy: build quietly, buy through agents, keep your wishlist private.

The game can implement both sides. The player who buys openly (visible in the SaintTracker bar) triggers AI bidder aggression. The player who buys relics from different saints, hides their true target, and only reveals their hand late has an information advantage. This creates a strategy layer that emerges naturally from the interaction between two experts' independent insights.

### Connection 7: The Dark Historian's "Weird Relics" Solve the Game Designer's "Meaningless Abundance" Problem

The Game Designer identifies a failure mode: if all relics feel the same, trading becomes mechanical. The current relic list (bones, teeth, hair, vials of dust) risks homogeneity.

The Dark Historian's catalog of strange relics — the Holy Foreskin claimed by a dozen churches, the liquefying blood of San Gennaro, the incorrupt bodies, the Sacro Catino that turned out to be glass instead of emerald — provides the antidote. These are relics with stories. A relic with a contested claim (three churches claim the head of John the Baptist) is inherently more interesting to trade than a generic rib fragment. A relic that "liquefies" (with a visual animation?) creates a memorable game moment.

The weirdness is not just flavor. It creates mechanical variety. A contested relic has higher volatility (multiple claimants drive unpredictable demand). An incorrupt body has lower depreciation (it is, by definition, resistant to decay). A relic whose provenance includes a famous theft (the theft of St. Mark's body hidden under pork) has a premium. Each strange relic is also a unique trading opportunity.

---

## PART 4: THE HYPOTHETICAL DESIGN SESSION

*Five experts around a table. The room is a monastery basement repurposed as a conference room. There is a whiteboard. There is coffee. The Terminal Designer has drawn a grid on the whiteboard. The Art Historian has spread photocopies of medieval provenance documents across the table.*

**GAME DESIGNER:** Let me frame the problem. We have a game that feels like a terminal already. The BSP grid, the ticker, the heresy feed — the aesthetic is there. What we do not have is a reason to look at it for more than ten minutes. The current game is spend-until-broke. The question is: what does the core loop become?

**ECONOMIST:** The loop is buy-hold-sell. Every relic is an asset with a fluctuating market price. The player buys when prices are low, sells when they are high, and uses the profits to fund their collection. The math works: starting at 2,000 credits, completing Teresa requires roughly doubling your money through 7-9 trades at 10% average profit. That is achievable in 15-25 minutes of play.

**TERMINAL DESIGNER:** The key word there is "play." The current game is already exciting in 10-second bursts — a lot is expiring, you are outbid, the heresy fires and you snipe an auction. If we add a sell mechanic, we cannot lose that energy. I do not want a "sell phase" where the player stares at a portfolio screen.

**GAME DESIGNER:** I hear that, but trading requires analysis time. You cannot evaluate a portfolio while lots are expiring around you. The phase system solves this: three minutes of market chaos, then a breather to manage your positions.

**TERMINAL DESIGNER:** Bloomberg traders do not get breathers. They manage positions *while* the market is live. That is the skill. The terminal gives you the information density to do both. What if instead of phases, we give the player a toggle? Market view for buying, portfolio view for selling. Same real-time clock, but you choose what to focus on.

**ECONOMIST:** I can work with either. The price model is continuous — the Ornstein-Uhlenbeck process ticks every 5 seconds regardless. But I will say: the 15-second Briefing phase has value. Not for analysis, but for anticipation. The player sees tomorrow's lots. They see the decree in the terminal. They have 15 seconds to form a plan before the bell rings. That is not a pause — it is the moment before the doors open at a sample sale. It is its own form of tension.

**ART HISTORIAN:** If I may — real auctions have exactly this structure. The viewing day before the sale. Specialists circulate, catalog in hand, studying the lots. Then the gavel falls and it is all action. The briefing phase maps directly to the pre-sale viewing. It is not an interruption of excitement. It is where the excitement begins.

**DARK HISTORIAN:** And the terminal feed during the briefing is where you read the omens. The historical equivalent: rumors before a market event. Word reaches your monastery that the Cathars have been seen in the region. You know what that means for relic prices. You have a few minutes to prepare. Then chaos.

**GAME DESIGNER:** So we keep the briefing. Short — 15 seconds, enough to scan, not enough to optimize. Then 3 minutes of live market. Then — and this is where I push back against pure real-time — a settlement phase where the player enshrines relics.

**TERMINAL DESIGNER:** Why can the player not enshrine during the market?

**GAME DESIGNER:** Because enshrining should feel deliberate. It is permanent. You are locking a relic away forever. If the player can do it during market chaos, they will enshrine impulsively and regret it. The settlement phase forces them to look at the full picture: what do I own, what is it worth, what am I committing to?

**ART HISTORIAN:** In real collecting, the decision to keep a piece rather than sell it is always made away from the auction floor. You do not decide to build a collection while the gavel is falling. You decide at home, in your study, looking at the catalog.

**ECONOMIST:** Fine. I will design the settlement phase to be economically interesting. The player sees a market summary: what prices moved, which AI collectors acquired what, what the forecast looks like. This is the morning research report. Then they enshrine. Then they see the next day's briefing. The loop is: study, trade, settle, repeat.

**DARK HISTORIAN:** Can we talk about what the terminal feed actually says? Because right now it is "FLAGELLANT heresy detected" and that is it. The historical material is so much richer. A Cathar event should say something like: "CATHARI PREACHERS IN TOULOUSE — MATERIAL RELICS DENOUNCED AS DEVIL'S WORK." A Flagellant event: "FLAGELLANT PROCESSION THROUGH ROME — PENITENTIAL RELICS FLOODING MARKET." The feed should tell you not just what happened but what it means economically, through narrative.

**TERMINAL DESIGNER:** I love that. The feed becomes a newswire. Market transactions, heresy reports, AI collector movements, demand events — all interspersed. The player who reads carefully trades better. The Bloomberg terminal works exactly this way: the news feed is on the same screen as the price data, and the best traders are the ones who process both simultaneously.

**ECONOMIST:** Speaking of AI collectors — they need to be visible. The terminal should announce their moves. "RIVAL COLLECTOR BORGIA at 8/12 AMBROSE — NEAR COMPLETION." This creates the information the player needs for strategic bidding. If Borgia needs Ambrose relics, I can either compete or sell to them at a premium.

**ART HISTORIAN:** The competing collector dynamic is the most authentic thing in this game. Real auction rooms are defined by who else is bidding. The rivalry between collectors is what creates legendary price moments. We should name the AI collectors after historical figures — the Borgias, the Medicis, Cardinal Orsini. Or invent names that feel right: Brother Augustine, Mother Caecilia, the Venetian Consortium.

**GAME DESIGNER:** Agreed. Let me push on one more thing: the enshrine mechanic. The Economist's report proposes that completing a saint requires simultaneously holding all relics. That means you need to accumulate the full set in your portfolio before locking them in. This is a critical decision — do you enshrine piece by piece (safer but ties up capital longer) or collect them all in portfolio and enshrine at once (riskier, but your capital stays liquid longer)?

**ECONOMIST:** My model assumes piece-by-piece enshrining. Each enshrine reduces your liquid capital. The tension is gradual: every enshrine makes you poorer. If we require simultaneous holding, the tension is sudden: the player must commit a huge capital chunk all at once.

**GAME DESIGNER:** Piece by piece is better for pacing. The player feels each enshrine as a step. The progress bar fills. But each step costs them. "TERESA: 6/8 enshrined. Two more to go. My trading capital is down to 800. I need to make these last two count." That is a story.

**DARK HISTORIAN:** And when you enshrine that last piece — the stone slides into place. The saint is complete. The golden overlay fills the screen. That is the cathedral moment. That is what all the trading was for.

**ART HISTORIAN:** One more thing. The price system needs to reflect what I know about real relic valuation. Not all relics within a saint are equal. The head, the heart, the right hand — these are signature relics worth multiples of a tooth or a rib fragment. Francis's stigmata hand cloth should open at 400+. A dust-of-tibia should open at 20. The spread within a saint should be dramatic.

**ECONOMIST:** That maps cleanly onto my model. The base equilibrium price (mu) varies by body part rank within each saint. Signature relics have a high mu and high sigma (expensive and volatile). Minor relics have a low mu and low sigma (cheap and stable). The player's strategic question becomes: do I chase the expensive signature relic first, or do I hoover up the cheap fragments and leave the expensive one for last?

**GAME DESIGNER:** Leaving the expensive one for last is a trap. The completion premium means the last relic is the most expensive regardless. But if the last relic is also a signature piece, it is the most expensive *and* carries a completion premium. The player who recognizes this buys the signature relic early when it is "merely" expensive, not astronomically expensive.

**ART HISTORIAN:** That is exactly how smart collectors operate. You buy the trophy piece first, when nobody knows you are building the set. Then you quietly acquire the minor pieces. If you buy the minor pieces first, the market sees your intent and the trophy piece becomes unreachable.

**TERMINAL DESIGNER:** And the SaintTracker bar shows your progress. Which means the AI can see it too. If the player is at 10/12 Ambrose, every AI bidder should know that and bid accordingly.

**GAME DESIGNER:** So the meta-strategy is: hide your intent. Trade relics from saints you are not collecting, to fund quiet acquisition of the ones you are. The SaintTracker tells everyone your progress, but your portfolio does not reveal which relics you *plan* to enshrine versus which ones you are just holding for profit.

**ECONOMIST:** This is beautiful. The information game runs in both directions. The player reads the AI. The AI reads the player. The terminal feed is the battleground where information is leaked and exploited by both sides.

**TERMINAL DESIGNER:** And it all lives on one screen. Grid in the center: the market. Ticker on the left: your positions. Feed on the right: intelligence. Portfolio view toggled as needed. Net worth in the title bar, always ticking. The player is a relic broker staring at a terminal in a monastery basement, watching the market move, looking for the edge.

**DARK HISTORIAN:** A monastery basement that smells of incense and old bone. The terminal hums. The cursor blinks. A Cathar heresy fires and Catherine relics dip and you buy, buy, buy — because you know the faithful will come back to their saints, they always do, and when they do, you sell.

**GAME DESIGNER:** That is the game. That is the pitch.

---

## PART 5: SYNTHESIS — THE GAME WE SHOULD BUILD

### The Core Concept

HOLY_OPS.EXE is a single-player trading game disguised as a medieval relic auction. The player operates a clandestine relic exchange terminal, buying sacred bones and teeth at auction, holding them as the market fluctuates, and selling them for profit — all while trying to complete saint collections before time runs out. It is Bloomberg Terminal meets Canterbury Tales: an information-dense, aesthetically striking game about reading a market, exploiting edges, and deciding when a relic is worth more as capital and when it is worth more as devotion.

### The Core Loop

Each session is structured as a series of Market Days. Each day opens with a 15-second Briefing (scan the terminal feed for demand signals, heresy warnings, and rival collector movements), then 3 minutes of Open Market (real-time auctions with AI bidders, fluctuating prices, heresy-driven disruptions), then a Closing Bell (final scramble), then untimed Settlement (review your portfolio, enshrine relics into your permanent collection, plan for tomorrow). The player buys relics at auction when they are underpriced, sells them on the market when they are overpriced, and enshrines them when they are ready to commit to a saint. Every relic in the portfolio is simultaneously an investment and a potential piece of a sacred collection. The tension between trading and collecting — between profit and devotion — is the game.

### The Economy

Relic prices follow a mean-reverting model with event-driven shocks. Each relic has an equilibrium price determined by its class (body parts are worth more than touched objects), saint fame, body part rank, provenance chain quality, and authentication status. Prices fluctuate around this equilibrium, driven by heresy events (each of five sects affects different saints differently), demand surges (papal decrees, pilgrimage waves), supply shocks (Crusade hauls, monastery dissolutions), and the completion premium (the last relics of any saint become astronomically expensive). AI market participants have distinct personalities — Devotees pursuing specific saints, Speculators competing with the player on timing, Liquidators creating buying opportunities, and rival Collectors whose visible progress creates strategic urgency. The player starts with limited capital and must trade their way to wealth sufficient to complete their target saints. A single currency (the Obol) keeps things clean; the complexity lives in the multi-dimensional relic valuation, not in the monetary system.

### What Makes It Special

Three things make HOLY_OPS unlike anything else. First, the terminal aesthetic is not a skin — it is the gameplay surface. The BSP grid is a living heat map where lot size reflects market activity, the scrolling feed is a skill-gated intelligence stream, and the portfolio view with its green and red P&L numbers creates the emotional texture of real trading. Second, the medieval relic setting provides something no financial theme can: emotional attachment. A Treasury bond is a number; the transverberated heart of St. Teresa is a story. The moment when you decide to sell that heart at peak price, sacrificing your Teresa collection progress for profit, is more painful and more interesting than any spread trade. Third, the heresy system — five historical sects, each disrupting the market in thematically grounded ways — creates a learnable pattern system that rewards deep engagement. The player who has internalized that Cathari events depress Catherine and Teresa prices, who reads the terminal feed for early signals, who watches rival collectors for positioning data, who buys signature relics before revealing their intent — that player is not just clicking buttons. They are reading a market. And reading a market, in a room full of sacred bones and flickering terminal light, turns out to be a very good time.

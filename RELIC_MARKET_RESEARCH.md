# Relic Valuation & Market Mechanics: Research Report for HOLY_OPS.EXE

**Prepared by:** Auction House Consultant, Medieval Ecclesiastical Objects
**For:** HOLY_OPS.EXE game design team
**Date:** March 2026

---

## 1. How Relics Were Actually Valued Historically

The game's Class I/II/III system is accurate to Catholic canon law, but the medieval market did not price relics so neatly. Real valuation was a multi-axis problem.

### The Hierarchy of Value (What Made One Relic Worth More)

**Saint's Rank and Fame.** The cult of saints was not egalitarian. The Virgin Mary outranked all. The Apostles came next, then the early Church Fathers, then the martyrs of the persecutions, then local patron saints. A tooth of St. Peter was worth more than the entire skeleton of a minor regional martyr. The game's eight saints already have very different fame profiles — Ambrose and Francis are A-list; Agatha and Bartholomew are solid B-tier; Lucia and Sebastian fall between. This should be reflected in pricing. A Francis Class I relic should have a much higher floor than an Agatha Class I.

**Body Part Specificity.** Not all Class I relics are equal. The hierarchy within body parts was roughly:
- **Head/skull** — the most prized body relic, considered the "seat of the soul." Catherine of Siena's head, still in the Basilica di San Domenico, was the relic that defined the city's identity. The game already has this as Catherine's first relic.
- **Heart** — especially after the cult of the Sacred Heart developed. Teresa of Avila's transverberated heart remains one of the most famous relics in Christianity. Again, already in the game.
- **Right hand/arm** — the blessing hand. Immensely valued for ritual use.
- **Blood** — liquid relics were considered miraculous when they liquefied (see: San Gennaro's blood in Naples, still ceremonially displayed).
- **Teeth, ribs, finger bones** — common, numerous, and therefore less valuable individually.
- **Dust, nail clippings, hair** — lowest tier of Class I, verging on Class III territory.

**Gameplay translation:** Relics within each saint should have individual value modifiers. The Head, Heart, and Right Hand should carry a significant premium. Teeth and rib fragments should be cheap. This creates interesting bidding decisions — do you chase the expensive signature relic or hoover up the cheap bones first?

**Miracle-Working Reputation.** A relic that was associated with documented miracles was worth exponentially more. Miracles were the medieval equivalent of a provenance bump at auction — independent third-party validation. The blood of San Gennaro liquefies three times a year (or fails to, which the Neapolitans regard as an omen). Thomas Becket's blood was mixed with water and sold as "Canterbury Water" in ampullae — a kind of Class III franchise operation.

**Provenance Chain Quality.** Where the relic had been mattered as much as what it was. A bone fragment from the papal collection at the Sancta Sanctorum in Rome was worth more than the same bone from an obscure rural church, because the papal collection implied centuries of custodial verification. The game currently generates a single provenance line — this could be expanded into a chain: "Sancta Sanctorum, Rome, 1204 -> Cardinal Colonna Collection, 1312 -> Basilica di Sant'Ambrogio, Milan, 1423." Longer chains with more prestigious custodians = higher value.

**Political Significance.** Relics were instruments of statecraft. Charlemagne's collection at Aachen legitimized his claim to be a new Roman emperor. The Byzantine emperors used relic gifts to cement alliances — when Manuel I Comnenus sent a piece of the True Cross to the King of Jerusalem, it was a diplomatic act equivalent to a modern arms deal. The French crown's collection at Sainte-Chapelle (built specifically to house relics Louis IX purchased from Constantinople) cost 135,000 livres — more than the chapel itself.

**Competing Claims / Contested Authenticity.** Multiple churches claiming the same relic was common and actually *increased* aggregate demand, because each institution had to bid up their claim's prestige. At least three churches claimed to possess the head of John the Baptist. The resulting competition drove pilgrimage traffic and donations to all three.

### Actual Medieval Prices

Hard price data is sparse, but some transactions are documented:

- **Baldwin II's relic sales (1238-1241):** The Latin Emperor of Constantinople, nearly bankrupt, sold the Crown of Thorns to Louis IX of France for approximately 135,000 livres tournois. For scale, the annual revenue of the French crown at the time was roughly 250,000 livres. This single relic cost over half a year's royal income.
- **The Holy Lance:** Changed hands multiple times. The Byzantines valued it so highly that its loss during the Fourth Crusade was considered as significant as the loss of Constantinople itself.
- **Everyday relics at fairs:** Smaller relics — bone chips, contact relics, branded ampullae — traded at medieval fairs for prices accessible to merchants and minor clergy. A small bone fragment might go for a few silver coins. The range from top to bottom was enormous — several orders of magnitude.

**Gameplay translation:** The current starting bid range of 15-150 is too flat. A Francis Stigmata Hand Cloth (Class II, but the signature relic of arguably the most famous saint in the game) should open at 400+. A Dust of Tibia (effectively Class III material in a Class I wrapper) should open at 10-30. The spread should be dramatic.

---

## 2. The Real Medieval Relic Trade

### The Fourth Crusade (1204): The Great Relic Flood

The sack of Constantinople in 1204 is the single most important event in relic trade history. The city had been accumulating relics for eight centuries as the capital of Eastern Christendom. When the Crusaders breached the walls, they looted not just gold and silver but the largest concentration of sacred objects on earth.

The resulting flood of relics into Western Europe is directly analogous to a market-moving event in the game. Suddenly, supply exploded. Relics that had been locked away in Byzantine imperial chapels were now circulating in Venice, Paris, and Cologne. Some effects:

- **Prices initially crashed** for common relics (bone fragments, contact relics) because supply overwhelmed demand.
- **Prices for unique/signature relics skyrocketed** because now there was proof they existed and buyers were competing.
- **Provenance became contested** — half of Western Europe claimed to have relics "from Constantinople" with varying degrees of truth.

**Gameplay translation:** "Market flood" events. Every N minutes, a "Crusade haul" or "Monastery dissolution" event dumps 8-12 lots simultaneously. Common relics come cheap; rare ones get bid wars. This would be a strategic moment — do you grab cheap filler pieces or compete for the crown jewels?

### Furta Sacra: Holy Theft

The medieval world had an entire literary genre celebrating relic theft. The logic was theological: if a saint's relic was stolen and the saint didn't prevent it (through miraculous intervention), the saint must have *wanted* to be moved. The theft was divine will.

Famous cases:
- **The theft of St. Mark's body from Alexandria (828):** Venetian merchants smuggled the Evangelist's remains out of Muslim-controlled Egypt, allegedly hiding the body under a layer of pork to discourage Muslim inspectors. This is Venice's founding myth. The entire Basilica di San Marco was built for this stolen relic.
- **The translation of St. Nicholas from Myra to Bari (1087):** Sailors from Bari broke into the saint's tomb, gathered his bones, and fled. Bari became a major pilgrimage center overnight.
- **Einhard's acquisition of saints Marcellinus and Peter:** Charlemagne's biographer sent an agent to Rome to acquire relics. The agent, Deusdona, was essentially a professional relic dealer who "sourced" relics from Roman catacombs through dubious means.

**Gameplay translation:** A "furta sacra" mechanic where relics occasionally appear with the tag "DISPUTED ORIGIN" or "CONTESTED PROVENANCE" — they're cheaper, but there's a chance they'll be "reclaimed" (removed from your collection) later. Risk/reward tension.

### Relics as Economic Engines

A major relic didn't just sit in a church — it generated revenue. Pilgrimage traffic brought:
- **Offerings at the shrine** (direct income)
- **Spending in the town** (inns, food, souvenirs — medieval Canterbury had an entire economy built on Becket pilgrimage)
- **Indulgences** (later period, but the financial logic was present earlier)
- **Prestige that attracted further donations and bequests**

The shrine of Thomas Becket at Canterbury was so rich that Henry VIII's commissioners who dissolved it in 1538 reportedly needed 26 carts to carry away the treasure accumulated around it.

**Gameplay translation:** Completed saint collections could generate passive income — a slow trickle of currency representing pilgrimage revenue. This gives the player a reason to complete a cheap saint early (cash flow) before pursuing expensive ones.

### The Relic Dealer as a Profession

Professional relic dealers (negotiatores reliquiarum) were a real occupation. They operated in the gray area between legitimate trade and fraud. The most famous is Deusdona, a Roman deacon in the 9th century who ran a brisk export business selling Roman catacomb relics to Frankish buyers. He had agents, a supply chain, and what we would now call "marketing" — he would provide authenticity documents and sometimes arrange for convenient "miracles" at the point of delivery.

**Gameplay translation:** The player IS a relic dealer. The game could lean into this identity harder — perhaps with a reputation system where your authentication track record affects what lots you're offered.

---

## 3. Provenance and Authentication

### How Relics Were Authenticated

The medieval authentication system was surprisingly formal, though entirely pre-scientific:

**Authentica (sealed documents).** A relic was supposed to travel with a written document sealed by a bishop or higher authority, certifying its identity and chain of custody. These documents (called "authentica") were often placed inside the reliquary itself. The Fourth Lateran Council (1215) explicitly required that relics not be displayed outside reliquaries or sold without papal approval — evidence that the market had gotten out of hand.

**Wax seals and episcopal letters.** A bishop's seal on an authentica was the gold standard. The seal of a Roman cardinal was better. A papal bull was the ultimate authentication. The integrity of the seal was itself a verification method — broken seals meant potential tampering.

**Miracle testimony.** The most powerful authentication was miracles. If a relic healed the sick, that was considered proof it was genuine — the saint wouldn't work miracles through a fake. Churches kept *libri miraculorum* (miracle books) documenting healings and wonders at their shrines. These were essentially medieval provenance portfolios.

**Visual/physical inspection.** Relics were examined for consistency with known facts about the saint. Did the bone look the right age? Was the blood the right color? Was the cloth consistent with the period? This was crude but not nothing.

**Chain of custody testimony.** Oral and written testimony from previous custodians. "Father Anselm received this from Bishop Gerard, who received it from the papal legate, who brought it from the Sancta Sanctorum."

### How Provenance Was Fabricated

Every method of authentication was also a method of fabrication:

- **Forged authentica** were common. Monasteries with good scriptoria could produce convincing sealed documents. The Abbey of Saint-Denis was notorious for creative provenance documentation.
- **Miracle staging.** Confederates in the crowd would fake healings. Guibert of Nogent wrote a scathing critique of this practice in his *De pignoribus sanctorum* (c. 1125), one of the earliest skeptical treatments of relic fraud.
- **Relabeling.** Generic bones from catacombs were given names of famous saints. Deusdona's entire business model relied on this — Roman catacombs were full of anonymous Christian dead, and the temptation to upgrade an unknown martyr to a named saint was irresistible.
- **Splitting and multiplying.** A single relic could be divided, and each piece claimed as the whole. This is why Calvin's ship-of-True-Cross observation was so devastating.

### Deepening the Game's Provenance System

The current system generates `"Basilica di Sant'Ambrogio, Milan, 1423"` — a single line. Here's how to make provenance a gameplay axis:

**Provenance depth (number of links in the chain):**
- 1 link: "Unknown monastery, 1487" — cheap, suspicious
- 2-3 links: "Cathedral of Cologne, 1298 -> Private collection, Venice, 1412" — standard
- 4-5 links: "Imperial Chapel, Constantinople, 1180 -> Crusader spoils, 1204 -> Cardinal Orsini, 1267 -> Abbey of Cluny, 1340 -> Basilica di Sant'Ambrogio, 1423" — premium

**Provenance quality tiers:**
- Papal/Imperial provenance (highest)
- Cathedral/Major basilica provenance
- Monastery/Abbey provenance
- Private collection provenance
- "Found" or undocumented (lowest — but potentially a sleeper)

**Authentication status as a lot attribute:**
- VERIFIED — full documentation, episcopal seal
- ATTESTED — partial documentation, credible oral history
- DISPUTED — competing claims or broken chain of custody
- UNVERIFIED — no documentation, buyer beware

This creates a secondary market for information: a DISPUTED relic is cheap, but if you could somehow verify it, its value jumps. An UNVERIFIED lot might be worthless junk or a priceless find.

---

## 4. Modern Auction House Mechanics

### How a Real Auction Works for Medieval Ecclesiastical Objects

I'll walk through the lifecycle of a lot at a major house, because almost every step can become a game mechanic.

**Consignment and cataloguing.** The owner brings the object to the auction house. Specialists research it: What is it? Where did it come from? What's its condition? Is the provenance clean? This research takes weeks or months. The result is a catalogue entry with a physical description, provenance, exhibition history, literature references, and an estimate range.

**The estimate range.** Every lot gets a low and high estimate. This is the house's best guess at the hammer price, based on comparable sales. The range is wide enough to attract both cautious and optimistic buyers. A reliquary might be estimated at $30,000-50,000. This anchors bidding expectations.

**Gameplay translation:** Each lot could display an estimate range. The AI bidders and the starting bid are calibrated to this range. Going above the high estimate is a statement — you really want this piece. Going below the low estimate is a bargain hunt.

**The reserve price.** A secret minimum price below which the lot will not sell. Typically at or just below the low estimate. If bidding doesn't reach the reserve, the lot is "bought in" — it goes unsold. Approximately 20-30% of lots at major auctions fail to sell.

**Gameplay translation:** Some lots should have reserves. If nobody (player or AI) bids above a certain threshold, the lot is withdrawn — "BOUGHT IN" status. This creates urgency: you might lose a piece not to a rival but to the market floor.

**The buyer's premium.** The winning bidder pays the hammer price PLUS a premium to the auction house. At Christie's and Sotheby's, this is currently 26% on the first $1M, 20% up to $6M, and 14.5% above. In the medieval context, brokers and intermediaries always took their cut.

**Gameplay translation:** A 15-20% buyer's premium on all wins. Your bid of 100 actually costs you 115-120. This affects budget math significantly and makes overbidding more punishing.

**Condition reports.** Every lot has a condition report noting damage, restoration, losses, and wear. A reliquary with original enamel intact is worth multiples of one with losses. A relic with intact wax seals on the authentica is worth more than a loose bone.

**Gameplay translation:** Relics could have condition grades: PRISTINE, GOOD, FAIR, POOR. Condition affects both price and visual presentation. A POOR condition relic might have a cracked visual, a dimmer image. Condition also affects the "pilgrimage income" if you implement passive revenue from completed collections.

**Bidding psychology in the room.** Real auction excitement comes from:
- Two or more determined bidders locked in combat, each refusing to yield
- A lot that blows past its high estimate (signals that the market has revalued something)
- "Fresh to market" pieces — objects that haven't been publicly sold in decades
- The "last lot" effect — bidders who've lost earlier lots get more aggressive later
- Phone bidders (anonymous, often institutions or very wealthy collectors) who enter late and relentlessly

**Gameplay translation:** AI bidders should have personalities. Some are cautious (drop out at the high estimate). Some are aggressive (will pay 2-3x estimate for pieces they need). Some enter late in the auction ("phone bidder" AI that only bids in the last 20 seconds). The player should be able to learn AI behaviors and anticipate them.

### What Drives Prices Above Estimates

At real auctions, the factors that cause a lot to "go nuclear" are:

1. **Two institutions both need it.** When the Met and the V&A both want the same medieval ivory, the sky is the limit because neither answers to a personal budget.
2. **Rarity plus condition.** A unique object in perfect condition is the ultimate lot.
3. **Rediscovery.** Something thought lost, or unrecognized in a private collection, suddenly identified as important.
4. **Celebrity provenance.** Owned by a famous collector, exhibited at a landmark show, published in a major book.
5. **Market momentum.** If the first few lots in a sale go well above estimate, bidders get excited and spend more freely on subsequent lots.

---

## 5. What Makes a "Good Lot" in the Real Market

### The Quality Stack

In real auction practice, I evaluate an object across multiple dimensions. Every one of these could be a relic attribute:

**Rarity.** How many comparable pieces exist? A bone of St. Peter is essentially unique (there's one skeleton, and pieces are scattered among a handful of churches). A chip of the True Cross is one of thousands. The game already has implicit rarity (each saint has a fixed number of relics), but rarity could also be layered onto individual pieces — "only known example of a complete Teresa foot bone" vs. "one of many rib fragments."

**Condition.** As discussed above. A sealed reliquary with intact authentica is worth 5-10x an unsealed one.

**Aesthetic quality.** Some relics are visually stunning. Gold and enamel reliquaries, jeweled monstrance settings, ivory carved containers. Others are just a bone in a cloth bag. The container matters enormously in the real market — at auction, a beautiful Gothic reliquary will sell for its decorative arts value even if the relic inside is dubious.

**Gameplay translation:** Each relic could have a "reliquary quality" attribute: BARE (no container), SIMPLE (plain wood/metal box), FINE (carved, gilded), MAGNIFICENT (jeweled, enameled). This affects both display price and visual appearance in the collection.

**Exhibition history.** A relic that was displayed at a major exhibition (the Met's "Treasures of the Holy Land," the V&A's "Medieval and Renaissance" galleries) has a pedigree that adds value. In the game, this could be generated flavor text that signals quality: "Exhibited: Papal Treasury Exhibition, Vatican, 1892."

**Published scholarship.** If a relic appears in a major academic publication, that's authentication by the scholarly community. "Published: Braun, *Die Reliquiare*, 1940, plate 47" adds legitimacy and value.

**Famous previous owners.** A relic from a named historical collection (the Medici, the Habsburgs, Cardinal Mazarin) commands a premium. The game's provenance system could include famous collector names as quality signals.

### Translating to Game Attributes

Each relic could have a generated "quality profile" composed of:

| Attribute | Range | Effect |
|-----------|-------|--------|
| Saint Fame | A/B/C tier | Base price multiplier |
| Body Part Rank | Signature/Major/Minor | Price multiplier within saint |
| Relic Class | I/II/III | Multiplier (I highest) |
| Provenance Depth | 1-5 links | Price bonus per link |
| Provenance Quality | Papal/Cathedral/Monastery/Private/Unknown | Multiplier |
| Authentication | Verified/Attested/Disputed/Unverified | Multiplier + risk factor |
| Condition | Pristine/Good/Fair/Poor | Multiplier |
| Reliquary Quality | Bare/Simple/Fine/Magnificent | Price bonus |

This creates enormous variation between lots and makes bidding decisions genuinely complex. A Class I relic of Francis in POOR condition with UNVERIFIED provenance might be cheaper than a Class II relic of Catherine in PRISTINE condition with a VERIFIED papal provenance chain.

---

## 6. The Concept of "Collections" in Art Markets

### The Completeness Premium

In real collecting, assembling a complete set creates a value that exceeds the sum of parts. A complete set of Audubon's *Birds of America* is worth far more than 435 individual plates sold separately. A complete set of Roman imperial portrait coins has a premium over the same coins sold individually.

The relic parallel is a complete saint — possessing all known relics of a single saint meant your church was *the* center of that saint's cult. The economic value of exclusive pilgrimage rights was enormous.

**The last-piece problem.** As a collection approaches completion, the remaining pieces become the collector's most expensive acquisitions. Everyone in the market knows you need that one last piece, and they can extract a premium. This is called the "collector's curse" or "the tyranny of the last lot."

**Gameplay translation:** This is already implicit in the game's structure (completing saints is the goal), but could be made explicit. When a player owns 7/8 of Teresa's relics, the AI should become more aggressive on the 8th piece — other "collectors" realize they can force the player to overpay. The final relic of any saint should be the most expensive, not by inherent value but by market dynamics.

### Building Quietly vs. Publicly

Real collectors face a strategic choice:
- **Build quietly.** Buy through agents, don't reveal what you're collecting, keep your wishlist private. This prevents competitors from front-running you.
- **Build publicly.** Announce your collection, use your reputation to attract consignments and private offers. This works when you have overwhelming resources.

In the game, the player's collection is visible (the SaintTracker bar, the Collection panel). AI bidders could react to this information — if they see the player is 10/12 on Ambrose, they bid more aggressively on Ambrose lots. This creates a tension: completing a saint requires showing your hand, which makes the final pieces harder to get.

### Competing for the Same Pieces

In real markets, when two collectors are known to pursue the same area, prices in that category inflate. The rivalry between J. Paul Getty and Norton Simon for old master paintings in the 1960s-70s drove prices to then-unprecedented levels. The competition between Ryoei Saito and Alan Bond for Impressionist masterpieces in the late 1980s produced the then-record $82.5M for van Gogh's *Portrait of Dr. Gachet*.

**Gameplay translation:** AI bidders should have visible "collection goals" — perhaps shown in the terminal feed. "RIVAL_03 acquiring LUCIA relics — 4/10 complete." This turns the game from player-vs-market to player-vs-specific-rivals, which is more engaging.

---

## 7. Price Volatility in the Real Art Market

### What Causes Price Spikes

**Rediscovery.** In 2019, a small Cimabue painting (*Christ Mocked*) was found in an elderly woman's kitchen near Compiegne, France. She had no idea what it was. It sold at Acteon auction house for EUR 24.2 million, against an estimate of EUR 4-6 million. Rediscovery is the ultimate market event.

**Attribution upgrade.** A painting "attributed to the workshop of Rembrandt" is worth perhaps $100K. The same painting reattributed to Rembrandt himself is worth $10M+. For relics, the equivalent would be re-identifying a relic — "previously catalogued as an unknown martyr, now identified as St. Francis through new documentary evidence."

**Market fashion.** Categories go in and out of fashion. Byzantine art was relatively cheap in the 1990s and has risen steadily. Demand for medieval manuscripts surged after several high-profile exhibitions. For the game, "fashion cycles" could be simulated: "DEMAND SURGE: LUCIA relics +40% this quarter."

**Museum acquisitions.** When a major museum buys a piece, it validates the entire category. Comparable pieces immediately rise in value. The Met acquiring a major medieval reliquary makes every similar reliquary more expensive.

**Deaccessioning scandals.** When a museum sells off collection pieces (deaccessioning) to raise operating funds, it floods the market and depresses prices. The Berkshire Museum controversy (2018) and the pandemic-era emergency sales sent ripples through the market.

### What Causes Price Crashes

**Forgery exposure.** When a prominent piece is revealed as a fake, everything from the same source or period becomes suspect. The Beltracchi forgery scandal (exposed 2010) depressed prices for early 20th-century German Expressionism for years.

**Provenance contamination.** If a relic's provenance is shown to include a known forger or fabricator, its value collapses. This happened repeatedly in the relic trade — when a particular dealer was exposed, everything they had sold became suspect.

**Market gluts.** Too much supply. The post-1204 Constantinople flood. The dissolution of English monasteries under Henry VIII, which dumped centuries of accumulated relics onto the market (or destroyed them).

**Competing claims proven.** If your church claims to have the head of St. John the Baptist and another church's claim is proven more credible, your relic's value drops to near zero.

### Game Event System

These historical dynamics suggest a rich event system:

| Event | Effect | Duration |
|-------|--------|----------|
| REDISCOVERY | A specific lot gets +200% AI interest | Single lot |
| ATTRIBUTION UPGRADE | A random UNVERIFIED relic becomes VERIFIED, price spikes | Instant |
| MARKET FASHION | All relics of one saint get +30-50% base price | 2-3 minutes |
| FLOOD EVENT | 8-12 lots spawn simultaneously, starting bids -30% | Instant |
| FORGERY SCANDAL | All UNVERIFIED/DISPUTED relics get -40% AI interest | 1-2 minutes |
| PAPAL BULL | All relics with Papal provenance get +25% | 2 minutes |
| RIVAL ENTERS | New aggressive AI bidder targets a specific saint | Permanent |
| MONASTERY DISSOLUTION | Large dump of one saint's relics, cheap but POOR condition | Instant |

---

## 8. Relic Fraud and Forgery

### The Scale of Medieval Relic Fraud

John Calvin's 1543 *Treatise on Relics* catalogued the absurdities: multiple churches claiming the same saint's head, enough pieces of the True Cross to fill a ship, multiple foreskins of Christ (the *Holy Prepuce* was claimed by at least 18 churches), three or more complete bodies of Mary Magdalene.

Guibert of Nogent's earlier *De pignoribus sanctorum* (c. 1125) describes specific fraud methods:
- Monks fabricating relics from animal bones
- Churches buying "authenticated" relics that were clearly modern fabrications
- Miracle-staging to validate fraudulent relics
- Political pressure to accept relics whose authenticity was known to be dubious (because the donor was powerful)

### Famous Fraud Cases

**The Holy Foreskin(s).** Perhaps the most notorious case of relic multiplication. At various points, the churches of Charroux, Coulombs, Calcata, Chartres, Antwerp, and many others all claimed to possess it. The Council of Trent eventually declared the topic off-limits to avoid embarrassment.

**The blood of San Gennaro.** Still displayed in Naples and still "miraculously" liquefies three times a year. Skeptics have demonstrated that the effect can be replicated with thixotropic gels (substances that liquefy when agitated). The Church has never officially pronounced on its authenticity.

**The Shroud of Turin.** Radiocarbon dated to 1260-1390. The Bishop of Troyes, Pierre d'Arcis, wrote to the Pope in 1389 claiming the shroud was a "cunningly painted" fake and that his predecessor had found the artist who made it. The Church's official position is deliberately ambiguous.

**The Donation of Constantine.** Not a relic but a forged document — supposedly Emperor Constantine's grant of temporal authority to the Pope. Lorenzo Valla proved it was a forgery in 1440 using textual analysis. Relevant because it shows that even the foundational "provenance documents" of the Church could be fabricated.

### Forgery as a Game Mechanic

This is where the game gets really interesting. Several approaches:

**The authentication gamble.** Some lots appear with "AUTHENTICATION PENDING" status. The player can bid on them at a discount, but after winning, a dice roll determines if the relic is genuine. If genuine, it's added to the collection at full value. If fraudulent, the player gets a "FORGERY" — money wasted, no collection credit. The odds depend on provenance quality: VERIFIED = 95% genuine, ATTESTED = 80%, DISPUTED = 60%, UNVERIFIED = 40%.

**The forgery reveal.** After a relic has been in the player's collection for some time, there's a small ongoing chance that it's "exposed" as a forgery — removed from the collection. Higher-provenance relics are safer. This creates a long-tail risk that makes provenance investment worthwhile.

**The duplicate saint problem.** If the game expands beyond 8 saints, some relics could have competing claims. Two lots might each claim to be the head of John the Baptist — but only one can be real. Buying both wastes money; buying the wrong one wastes money. How do you choose?

**The forger NPC.** A shadowy figure in the terminal feed occasionally offers "guaranteed authentic" relics at suspiciously low prices. These have a higher forgery rate but occasionally are genuine. Risk/reward mechanic for budget-constrained players.

**Authentication services.** After winning a relic, the player could pay extra to have it "authenticated" — reducing the chance of future forgery reveals. This is a money sink that creates interesting budget decisions: do you spend your remaining currency on more relics or on securing the ones you have?

---

## Appendix: Specific Design Recommendations for HOLY_OPS.EXE

Based on all the above, here are concrete changes to ground the game in real market mechanics:

### A. Price Overhaul

Replace the flat 15-150 random starting bid with a calculated price based on:
```
basePrice = saintFameTier * bodyPartRank * relicClassMultiplier
startingBid = basePrice * provenanceModifier * conditionModifier * (0.8 + random(0.4))
```

Approximate ranges:
- Cheap lots (minor bone, unknown provenance, poor condition): 10-40
- Standard lots (decent bone, cathedral provenance, good condition): 80-200
- Premium lots (signature relic, papal provenance, pristine): 300-600
- Trophy lots (Catherine's Head, Teresa's Heart with full provenance): 500-1000+

### B. Relic Quality Attributes

Extend the Relic interface:
```typescript
interface Relic {
  // ...existing fields...
  bodyPartRank: 'signature' | 'major' | 'minor';
  provenanceChain: ProvenanceLink[];
  authentication: 'verified' | 'attested' | 'disputed' | 'unverified';
  condition: 'pristine' | 'good' | 'fair' | 'poor';
  reliquaryQuality: 'bare' | 'simple' | 'fine' | 'magnificent';
  isForgery: boolean;        // hidden until revealed
  forgeryRisk: number;       // 0.0-1.0, based on authentication
}
```

### C. AI Bidder Personalities

Replace the uniform AI with distinct rival archetypes:
- **The Institutional Buyer** — deep pockets, targets verified/pristine relics, ignores cheap lots
- **The Completionist** — pursuing specific saints, gets aggressive near completion
- **The Bargain Hunter** — only bids on undervalued lots, drops out at fair value
- **The Phone Bidder** — invisible until the last 15 seconds, then bids aggressively
- **The Zealot** — irrational, will massively overpay for specific saints based on devotion

### D. Market Events

Timed events that shift the market, announced via the terminal feed:
- "PAPAL DELEGATION arriving — Class I premiums expected"
- "FORGERY RING exposed in Venice — UNVERIFIED lots under scrutiny"
- "CRUSADE SPOILS arriving from Constantinople — market flood imminent"
- "RIVAL COLLECTOR [name] entering market — targeting FRANCIS relics"

### E. Buyer's Premium

Add a 15% buyer's premium to all winning bids. Display it clearly: "HAMMER: 200 + PREMIUM: 30 = TOTAL: 230." This changes budget math and makes every bid slightly more expensive than it appears.

### F. Reserve Prices and Bought-In Lots

10-20% of lots should have hidden reserves. If the final bid doesn't reach the reserve, the lot status becomes "BOUGHT IN" instead of going to the highest bidder. This creates urgency — a piece you want might disappear from the market entirely if you don't bid enough.

### G. Passive Income from Completed Saints

Completed saint collections generate 2-5 currency per game tick, representing pilgrimage revenue. This creates a strategic incentive to complete a cheap saint early (Teresa at 8 relics, Agatha at 9) to fund acquisition of expensive saints later.

### H. Provenance Chain Display

When a lot is selected in the BidPanel, show the full provenance chain vertically:
```
PROVENANCE:
  Imperial Chapel, Constantinople (1180)
    -> Crusader spoils (1204)
      -> Cardinal Orsini Collection (1267)
        -> Abbey of Cluny (1340)
          -> Basilica di Sant'Ambrogio, Milan (1423)
AUTHENTICATION: VERIFIED [Episcopal Seal]
CONDITION: GOOD
```

This gives the player real information to evaluate before bidding.

---

## Sources and Further Reading

For the game team's reference, the key scholarly works on the medieval relic trade:

- Patrick Geary, *Furta Sacra: Thefts of Relics in the Central Middle Ages* (Princeton, 1978) — the definitive study of relic theft
- Charles Freeman, *Holy Bones, Holy Dust: How Relics Shaped the History of Medieval Europe* (Yale, 2011) — accessible overview
- Guibert of Nogent, *De pignoribus sanctorum* (c. 1125) — primary source on relic fraud
- John Calvin, *Treatise on Relics* (1543) — the great Protestant catalogue of relic absurdity
- Holger Klein, *Sacred Relics and Imperial Ceremonies at the Great Palace of Constantinople* — on the Byzantine relic economy
- Robert Bartlett, *Why Can the Dead Do Such Great Things?* (Princeton, 2013) — comprehensive study of saints and relics
- Braun, *Die Reliquiare des christlichen Kultes und ihre Entwicklung* (1940) — still the standard reference for reliquary classification

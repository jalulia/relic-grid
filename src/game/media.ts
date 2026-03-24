import { MarketState, MarketEvent, EventCategory } from './pricing';
import { HerasyReport } from './heresy';
import { Saint } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MediaArticle {
  type: 'lead' | 'secondary' | 'auth' | 'heresy' | 'private' | 'markets' | 'terminal';
  headline: string;
  subhead: string;
  body: string;
  dateline: string;
  timestamp: number;
  priority: number;
}

export interface AuthDeskItem {
  headline: string;
  body: string;
  status: 'verified' | 'disputed' | 'under_review' | 'fraudulent';
}

export interface HeresyBulletin {
  headline: string;
  body: string;
  severity: 'advisory' | 'elevated' | 'critical';
}

export interface PrivateSaleItem {
  text: string;
}

export interface MarketGlanceRow {
  saint: string;
  saintId: string;
  direction: 'up' | 'down' | 'flat';
  delta: number;
  demandLevel: number;
}

export interface FrontPage {
  lead: MediaArticle | null;
  secondary: MediaArticle | null;
  authDesk: AuthDeskItem[];
  heresyWatch: HeresyBulletin | null;
  privateSales: PrivateSaleItem[];
  marketGlance: MarketGlanceRow[];
  terminalFeed: { text: string; timestamp: number }[];
  edition: string;
  datestamp: string;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

function formatDateline(): string {
  const d = new Date();
  const months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  return `${months[d.getMonth()]} ${d.getDate()}, ANNO DOMINI ${d.getFullYear()}`;
}

function editionLabel(): string {
  const h = new Date().getHours();
  if (h < 6) return 'VIGIL EDITION';
  if (h < 12) return 'MORNING EDITION';
  if (h < 17) return 'AFTERNOON EDITION';
  if (h < 21) return 'VESPERS EDITION';
  return 'COMPLINE EDITION';
}

function saintNameById(id: string, saints: Saint[]): string {
  return saints.find(s => s.id === id)?.name ?? id;
}

// ---------------------------------------------------------------------------
// Headline and body templates — 10+ headlines, 5+ bodies per category
// ---------------------------------------------------------------------------

interface CategoryTemplates {
  headlines: string[];
  subheads: string[];
  bodies: string[];
}

const TEMPLATES: Record<string, CategoryTemplates> = {
  heresy: {
    headlines: [
      'Tribunal Widens Probe as Heretical Networks Disrupt Market Operations',
      'Market Confidence Shaken After Sect Activity Surge',
      'Exchange Integrity Under Review Following Doctrinal Breach',
      'Heretical Interference Forces Emergency Market Protocols',
      'Canonical Verification Systems Flag Multiple Provenance Chains',
      'Sectarian Operatives Identified in Institutional Bid Pools',
      'Tribunal Orders Full Audit of Affected Asset Classes',
      'Encrypted Bid Patterns Traced to Known Heretical Proxies',
      'Commission Suspends Authentication on Contested Lots',
      'Doctrinal Contamination Detected Across Three Saint Classes',
      'Purge Operations Disrupt Trading Floor as Tribunal Advances',
      'Heresy-Linked Provenance Documents Quarantined by Commission',
    ],
    subheads: [
      'Institutional collectors suspend acquisition activity pending resolution',
      'Enhanced monitoring protocols initiated across all saint classes',
      'Tribunal investigators embedded on exchange floor through end of session',
      'Multiple verified bidders flagged for secondary review',
      'Commission advises caution on all affected provenance chains',
    ],
    bodies: [
      'Canonical verification systems flagged multiple provenance chains as potentially compromised following a coordinated disruption attributed to sectarian operatives. Market confidence indicators declined sharply across affected asset classes, with several institutional collectors suspending acquisition activity pending resolution. The Pontifical Commission has dispatched additional tribunal oversight to the exchange floor.',
      'The Pontifical Commission has initiated enhanced monitoring protocols after detecting encrypted bid patterns consistent with known heretical proxy networks. Affected saint asset classes saw immediate price compression, though analysts expect partial recovery once tribunal operations conclude. Operators with exposure to the affected classes are advised to review positions.',
      'Intelligence reports indicate a sustained campaign by sectarian elements to infiltrate canonical verification channels. The resulting uncertainty has depressed bid activity across the affected classes, with market depth declining to levels not seen since the last major tribunal action. Commission officials have declined to specify a timeline for resolution.',
      'Exchange officials confirmed that multiple lots have been placed under administrative hold following the discovery of heretical insignia embedded in provenance documentation. The scope of the contamination remains under investigation, but preliminary assessments suggest the affected inventory spans at least two saint classes. Trading in unaffected classes continues under heightened scrutiny.',
      'The tribunal has expanded its investigation to include secondary market transactions completed within the past three sessions. Operators who acquired lots from flagged provenance chains may face retroactive review. Market participants have responded by widening bid-ask spreads across all classes, reflecting elevated counterparty risk.',
    ],
  },
  pilgrimage: {
    headlines: [
      'Pilgrim Surge Lifts Relic Demand Across Multiple Asset Classes',
      'Feast-Day Traffic Exceeds Projections, Prices Follow',
      'Devotional Wave Creates Buying Opportunity for Positioned Collectors',
      'Institutional Demand Spikes as Pilgrimage Season Intensifies',
      'Record Devotional Attendance Drives Broad Market Rally',
      'Caravan Arrivals Accelerate, Pushing Asset Prices to Session Highs',
      'Liturgical Calendar Convergence Fuels Unprecedented Demand',
      'Reliquary Traffic Doubles as Pilgrim Routes Reopen',
      'Commission Reports Peak Devotional Activity Across All Regions',
      'Feast-Day Confluence Creates Multi-Class Demand Pressure',
      'Pilgrim-Driven Demand Outpaces Available Lot Inventory',
    ],
    subheads: [
      'Early-positioned operators stand to benefit as prices appreciate',
      'Demand concentrated in corporeal and contact-class assets',
      'Lot queue unable to keep pace with devotional demand',
      'Market-watchers cite liturgical convergence as primary driver',
      'Supply constraints expected to persist through feast period',
    ],
    bodies: [
      'A sustained increase in devotional traffic has driven demand for high-provenance relics to levels not seen since the last jubilee cycle. Collectors with early positions in affected saint classes stand to benefit materially, while late entrants face premium pricing. Commission officials report that reliquary throughput has reached capacity.',
      'Market-watchers attribute the demand surge to a convergence of liturgical calendar events and favorable authentication outcomes. The resulting price appreciation has been broad-based, though concentrated in corporeal and contact-class assets. Institutional buyers have been particularly aggressive in the affected classes.',
      'The current pilgrimage wave has created what senior market observers describe as a generational acquisition opportunity for operators who established positions prior to the surge. Bid depth across affected saint classes has increased threefold, with institutional participants competing aggressively for authenticated lots.',
      'Devotional traffic along the primary routes has exceeded all projections for the current liturgical season. The resulting demand pressure has lifted prices across every saint class, though the most dramatic gains have been recorded in classes associated with the primary feast days. Late-session arrivals continue to stream into the exchange.',
      'Commission logistics officials have authorized emergency lot replenishment protocols in an attempt to meet the surge in devotional demand. Despite these measures, available inventory remains well below the level required to satisfy current bid volumes. Operators are advised that premium pricing conditions are likely to persist.',
    ],
  },
  papal: {
    headlines: [
      'Papal Decree Reshapes Authentication Standards Across Exchange',
      'New Bull Raises Bar for Relic Verification, Market Reacts',
      'Canonical Authority Issues Sweeping Market Directive',
      'Exchange Recalibrates Following Pontifical Intervention',
      'Papal Commission Redefines Class I Verification Threshold',
      'Bull of Canonical Reform Sends Ripples Through Asset Classes',
      'Pontifical Decree Alters Market Calculus for Institutional Buyers',
      'New Canonical Standard Creates Two-Tier Verification Regime',
      'Exchange Governance Updated to Reflect Papal Directive',
      'Authentication Framework Overhauled by Pontifical Order',
      'Market Adjusts to Post-Decree Verification Landscape',
    ],
    subheads: [
      'Institutional participants repositioning portfolios in anticipation of new regime',
      'Verification timeline extended for all pending Class I authentications',
      'Commission officials briefed operators on implementation schedule',
      'Canonical reform expected to favor high-provenance holdings',
      'Market consensus still forming on long-term implications',
    ],
    bodies: [
      'A newly issued papal directive has altered the verification threshold for Class I and Class II relics, creating both uncertainty and opportunity across the exchange. Institutional participants are reported to be repositioning portfolios in anticipation of the new regime. The Commission has indicated that implementation will proceed on an accelerated timeline.',
      'The pontifical decree establishes new documentation requirements for all authentication proceedings, effectively raising the evidentiary standard for provenance verification. Market analysts note that operators holding assets with deep provenance chains are likely to see valuations appreciate under the new framework, while holdings with thin documentation face potential downgrades.',
      'Exchange officials have begun implementing the canonical reforms mandated by the recent papal directive. The transition period is expected to create short-term volatility as the market adjusts to the new verification standards. Long-term observers describe the reforms as the most significant overhaul of authentication governance in recent memory.',
      'The papal intervention represents a decisive shift in the balance between market freedom and canonical oversight. Commission officials have emphasized that the reforms are designed to strengthen market integrity rather than constrain trading activity. Nevertheless, operators with positions in lightly documented asset classes are reviewing their exposure.',
      'Senior market participants have described the new canonical framework as broadly favorable for the health of the exchange, noting that stronger authentication standards tend to support asset valuations over time. The near-term adjustment, however, is expected to be turbulent as the market absorbs the implications of the decree.',
    ],
  },
  plague: {
    headlines: [
      'Plague Reports Drive Panic Buying in Protective Saint Classes',
      'Contagion Fears Reshape Market as Traders Flee to Safety',
      'Sebastian and Protective Relics Surge on Epidemic Intelligence',
      'Quarantine Protocols Disrupt Supply Lines, Market in Turmoil',
      'Epidemic Corridor Reported Along Primary Trade Routes',
      'Flight to Safety Lifts Protective Assets as Broader Market Declines',
      'Commission Issues Health Advisory, Market Enters Risk-Off Mode',
      'Plague Intelligence Triggers Defensive Repositioning Across Classes',
      'Contagion Risk Reprices Entire Market in Single Session',
      'Trade Route Closures Compound Supply Shock as Plague Spreads',
      'Protective Relic Premiums Reach Historic Levels on Plague Fears',
    ],
    subheads: [
      'Sebastian-class relics posting gains while broader indices decline',
      'Supply disruptions along trade routes compound volatility',
      'Operators advised to review exposure to non-protective classes',
      'Commission health monitors report elevated risk across three provinces',
      'Defensive positioning expected to persist until contagion contained',
    ],
    bodies: [
      'Reports of spreading contagion have triggered a flight to protective saint assets, with Sebastian-class relics posting significant gains while broader market indices declined sharply. Supply disruptions along primary trade routes are compounding the volatility, creating acute scarcity in the most sought-after protective classes.',
      'The epidemic intelligence emerging from border provinces has fundamentally altered the risk calculus for market participants. Operators are aggressively rebalancing portfolios toward saints associated with protection and healing, driving historic premiums in those classes. Assets without protective associations face sustained selling pressure.',
      'Commission health monitors have confirmed the spread of contagion along at least two major trade corridors, effectively severing supply lines that feed the exchange. The resulting inventory shortfall, combined with panic-driven demand for protective relics, has created market conditions that senior observers describe as unprecedented in the current cycle.',
      'Quarantine declarations by provincial authorities have reduced lot arrival rates to a fraction of normal levels. The exchange is operating with minimal inventory across most saint classes, with the exception of protective assets that command extreme premiums. Operators without established positions in Sebastian and related classes face prohibitive entry costs.',
      'The current epidemic event has exposed the fragility of the exchange\'s dependence on overland supply routes. Market strategists are recommending that operators maintain permanent defensive allocations in protective saint classes to hedge against future contagion events. The current crisis shows no signs of near-term resolution.',
    ],
  },
  war: {
    headlines: [
      'Military Action Floods Market with Looted Relics',
      'Trade Route Disruption Creates Supply Shock Across Classes',
      'War Spoils Depress Prices as Institutional Collectors Absorb Supply',
      'Crusader Returns Bring Wave of Unverified Relics to Exchange',
      'Ecclesiastical Properties Seized, Relic Supply Surges',
      'Conflict Zone Inventory Overwhelms Exchange Absorption Capacity',
      'Monastery Raids Release Previously Secured Assets onto Market',
      'Military Supply Influx Tests Authentication Infrastructure',
      'War-Origin Lots Create Pricing Dislocation Across Classes',
      'Commission Struggles to Verify Provenance of Conflict-Zone Relics',
      'Opportunistic Buyers Move on War-Discounted Inventory',
    ],
    subheads: [
      'Opportunistic collectors report favorable acquisition conditions',
      'Authentication backlog growing as war-origin lots arrive',
      'Commission warns of elevated forgery risk in conflict-zone inventory',
      'Institutional buyers deploying reserve capital to acquire discounted lots',
      'Supply normalization not expected until hostilities conclude',
    ],
    bodies: [
      'The seizure of ecclesiastical properties has released a wave of previously secured relics onto the open market, depressing prices across multiple saint classes. Opportunistic collectors report favorable acquisition conditions, though the Commission has cautioned that provenance verification for conflict-zone inventory requires enhanced scrutiny.',
      'Military operations in the contested provinces have severed multiple supply routes simultaneously, creating a bifurcated market: flooded in some saint classes by looted inventory, and starved in others by disrupted caravan traffic. The resulting pricing dislocations are attracting speculative capital from operators willing to accept elevated verification risk.',
      'The exchange authentication desk is operating at capacity as it processes a surge of war-origin lots with incomplete provenance documentation. Commission officials have warned that operators who acquire conflict-zone inventory without enhanced due diligence face the risk of retroactive de-authentication should tribunal review establish compromised chains of custody.',
      'Institutional collectors with deep capital reserves have begun systematically acquiring lots at war-depressed prices, a strategy that senior observers note has historically generated strong returns once supply conditions normalize. The current conflict-driven discount is estimated at fifteen to twenty-five percent below pre-hostility valuation levels.',
      'The pace of military relic seizures has accelerated, with multiple monastery holdings now in the process of dispersal to the open market. Commission logistics officials report that incoming lot volumes are testing the physical limits of exchange processing infrastructure. Operators are advised that lot quality may be uneven.',
    ],
  },
  authentication: {
    headlines: [
      'Provenance Verification Shifts Valuation on Key Asset Class',
      'Authentication Breakthrough Lifts Confidence in Target Class',
      'Forgery Exposure Sends Ripples Through Collector Networks',
      'Commission Authentication Desk Issues Landmark Determination',
      'Chain-of-Custody Breakthrough Validates Contested Provenance',
      'Fraudulent Documentation Ring Exposed by Tribunal Investigators',
      'Authentication Upgrade Drives Immediate Price Appreciation',
      'Provenance Downgrade Triggers Selloff in Affected Class',
      'Commission Certifies New Evidence in Long-Disputed Lineage',
      'Forensic Analysis Overturns Prior Authentication Ruling',
      'Verification Outcome Realigns Market Expectations for Saint Class',
    ],
    subheads: [
      'Market participants adjusting positions following determination',
      'Affected class expected to reprice across all provenance tiers',
      'Commission authentication desk operating under enhanced protocols',
      'Collector networks reassessing holdings in light of new evidence',
      'Institutional buyers moving to capitalize on verification outcome',
    ],
    bodies: [
      'A formal authentication determination has materially altered the valuation profile of relics within the affected saint class. Market participants are adjusting positions accordingly, with the most significant activity concentrated among institutional collectors who maintain dedicated authentication intelligence resources.',
      'The Commission authentication desk has released findings from an extended provenance investigation that definitively resolves a long-standing dispute over chain-of-custody documentation. The ruling is expected to lift valuations across the affected saint class by establishing a higher baseline of provenance certainty.',
      'Tribunal investigators have exposed a network of fraudulent documentation that had been used to support provenance claims across multiple lots. The affected inventory has been quarantined pending individual review, and operators who acquired lots from the compromised chain have been notified of potential de-authentication proceedings.',
      'Forensic analysis of reliquary materials has produced evidence that contradicts the previously accepted authentication ruling for a significant tranche of inventory. The resulting downgrade has triggered an orderly but decisive selloff in the affected class, with prices declining to levels that reflect the revised provenance assessment.',
      'The authentication breakthrough announced today represents the culmination of a multi-session investigation by Commission specialists. The positive determination has immediately attracted institutional capital to the affected saint class, with bid volumes exceeding available inventory within minutes of the official announcement.',
    ],
  },
  estate: {
    headlines: [
      'Treasury Liquidation Creates Rare Acquisition Window',
      'Estate Dispersal Brings Below-Market Assets to Exchange Floor',
      'Institutional Collector Wind-Down Offers Discounted Inventory',
      'Major Collection Dissolution Floods Market with Authenticated Lots',
      'Deceased Collector\'s Holdings Enter Market at Estate Pricing',
      'Commission Oversees Orderly Dispersal of Institutional Treasury',
      'Estate Sale Presents Generational Buying Opportunity',
      'Wind-Down Pricing Attracts Institutional Capital from Sidelines',
      'Treasury Lots Clear Below Reserve as Estate Executor Accelerates',
      'Authenticated Estate Inventory Draws Competitive Bidding',
      'Commission Registers Largest Estate Dispersal of Current Session',
    ],
    subheads: [
      'Quick-moving operators acquiring highest-provenance lots first',
      'Estate pricing represents fifteen to thirty percent discount to market',
      'Commission authentication desk confirms provenance integrity of estate lots',
      'Institutional capital deploying aggressively on discounted inventory',
      'Estate executor signaling willingness to clear inventory below reserve',
    ],
    bodies: [
      'The dissolution of a major collection has brought a tranche of authenticated relics to market at prices significantly below recent transaction levels. Quick-moving operators have already begun acquiring the highest-provenance lots, with institutional buyers competing aggressively for the most desirable inventory.',
      'Commission officials overseeing the estate dispersal have confirmed that all lots carry verified provenance documentation meeting current canonical standards. The resulting price discount is attributed entirely to the estate executor\'s mandate to achieve rapid liquidation, rather than any deficiency in authentication quality.',
      'The current estate event represents one of the more significant treasury dispersals observed in recent sessions. Market analysts estimate that the total inventory value, at pre-event market pricing, would exceed the aggregate transaction volume of a typical session. Operators with available capital are advised that current pricing conditions are unlikely to persist.',
      'Early activity in the estate lots suggests that institutional collectors are deploying reserve capital that had been held in anticipation of precisely this type of event. The most active bidding has been concentrated in saint classes where the estate held deep, well-documented positions. Remaining lots continue to enter the exchange at intervals.',
      'The estate executor has signaled a willingness to accept bids below the reserve pricing published at the start of the dispersal, an indication that the priority is speed of liquidation rather than value maximization. Operators positioned to act quickly may find acquisition conditions more favorable than initially anticipated.',
    ],
  },
  schism: {
    headlines: [
      'Schism Risk Elevates Volatility Across All Asset Classes',
      'Competing Claims Fragment Market Consensus',
      'Doctrinal Split Creates Two-Speed Market for Relic Assets',
      'Exchange Governance in Question as Canonical Authority Fractures',
      'Dueling Authenticators Undermine Market Pricing Confidence',
      'Schismatic Divide Splits Institutional Buyer Coalition',
      'Market Operates Under Dual Authority for Second Consecutive Session',
      'Canonical Fracture Widens, Market Volatility Intensifies',
      'Commission Jurisdiction Challenged by Rival Claimant',
      'Operators Navigate Pricing Uncertainty as Schism Deepens',
      'Parallel Authentication Regimes Create Arbitrage Conditions',
    ],
    subheads: [
      'Volatility spiking to levels associated with major regime change',
      'Institutional buyers divided on implications of competing claims',
      'Dual authentication standards creating pricing inconsistencies',
      'Commission officials declining to comment on rival claimant',
      'Operators advised to reduce position sizes until resolution',
    ],
    bodies: [
      'A widening doctrinal dispute has introduced significant uncertainty into relic pricing models. With institutional buyers divided on the implications, volatility has spiked to levels typically associated with major regime change events. Commission officials have offered no guidance on expected resolution timeline.',
      'The competing canonical claims have effectively created parallel authentication regimes, each supported by a faction of institutional collectors. The resulting market fragmentation has made consensus pricing nearly impossible, with identical lots trading at markedly different levels depending on which authentication authority the buyer recognizes.',
      'Market observers note that the current schismatic conditions bear structural similarities to previous episodes of canonical fracture, which historically resolved through either negotiated reunion or the decisive triumph of one claimant. In neither scenario did the transition occur quickly, suggesting that operators should prepare for an extended period of elevated uncertainty.',
      'The institutional collector community is reported to be deeply divided, with major players taking positions based not on market fundamentals but on their assessment of which canonical authority will ultimately prevail. This ideological dimension to market activity has made traditional pricing models unreliable.',
      'Trading volumes have declined significantly as operators who lack conviction on the schism outcome reduce their exposure. The resulting decline in market depth has amplified price movements, creating conditions where relatively modest bid activity can produce outsized valuation changes. Risk management has become the paramount concern.',
    ],
  },
};

// ---------------------------------------------------------------------------
// Authentication desk templates
// ---------------------------------------------------------------------------

const AUTH_DESK_TEMPLATES: {
  headline: string;
  body: string;
  status: AuthDeskItem['status'];
}[] = [
  { headline: 'Class I Femur Fragment — Provenance Confirmed to 1143 AD', body: 'Chain of custody verified through three monastic transfers. Commission seal applied.', status: 'verified' },
  { headline: 'Contested Vial — Competing Claims From Two Reliquaries', body: 'Dual provenance submissions under review. Both chains show documentary gaps in the 14th century.', status: 'disputed' },
  { headline: 'Phalangeal Relic — Awaiting Forensic Material Analysis', body: 'Bone density measurements pending. Radiocarbon dating results expected within two sessions.', status: 'under_review' },
  { headline: 'Blood Ampoule — Documentary Forgery Detected', body: 'Tribunal investigators identified anachronistic ink compounds in supporting provenance manuscript.', status: 'fraudulent' },
  { headline: 'Textile Contact Relic — Authentication Upgraded to Class II', body: 'New evidence from Byzantine archival sources strengthens attribution. Valuation adjustment in progress.', status: 'verified' },
  { headline: 'Cranial Fragment — Chain-of-Custody Break Identified', body: 'Gap between 1287 and 1334 remains unresolved. Lot placed under administrative hold.', status: 'under_review' },
  { headline: 'Blessed Oil — Fraudulent Sealing Wax Confirmed', body: 'Commission laboratory analysis reveals modern synthetic compounds in what was presented as period sealant.', status: 'fraudulent' },
  { headline: 'Devotional Medal — Contact Provenance Strengthened', body: 'Previously disputed chain of contact verified through newly discovered pilgrimage records.', status: 'verified' },
  { headline: 'Tooth Relic — Third-Party Forensic Report Challenges Attribution', body: 'Independent material analysis suggests dating inconsistent with claimed saint. Formal dispute initiated.', status: 'disputed' },
  { headline: 'Wrist Bone — Full Canonical Authentication Granted', body: 'After extended review, the Commission has issued unrestricted authentication with the highest confidence level.', status: 'verified' },
];

// ---------------------------------------------------------------------------
// Heresy watch bulletin templates
// ---------------------------------------------------------------------------

const HERESY_WATCH_TEMPLATES: {
  headline: string;
  body: string;
  severity: HeresyBulletin['severity'];
}[] = [
  { headline: 'DOCTRINAL STABILITY: NOMINAL', body: 'No significant heretical activity detected in current session. Standard monitoring protocols remain in effect. Commission recommends normal trading posture.', severity: 'advisory' },
  { headline: 'ELEVATED SECT ACTIVITY DETECTED', body: 'Commission intelligence assets report increased communications traffic among known heretical networks. Operators advised to verify counterparty provenance claims with additional scrutiny. No market restrictions in effect at this time.', severity: 'elevated' },
  { headline: 'CRITICAL: TRIBUNAL OPERATIONS ACTIVE', body: 'Active tribunal sweep in progress. Multiple provenance chains flagged for emergency review. Operators should anticipate potential lot quarantines and bid cancellations in affected classes. Exercise maximum caution.', severity: 'critical' },
  { headline: 'SECT MONITORING: ROUTINE', body: 'Periodic surveillance of known heretical communication channels reveals activity within normal parameters. No actionable intelligence at this time.', severity: 'advisory' },
  { headline: 'HERETICAL PROXY NETWORKS UNDER SURVEILLANCE', body: 'Commission cryptanalysts have identified new bid routing patterns consistent with known sectarian proxy infrastructure. Investigation ongoing. No market impact anticipated unless escalation occurs.', severity: 'elevated' },
  { headline: 'CRITICAL: DOCTRINAL CONTAMINATION EVENT', body: 'Multiple lots flagged for heretical insignia in provenance documentation. Immediate quarantine enacted. Operators holding affected inventory will receive direct notification from the tribunal.', severity: 'critical' },
  { headline: 'COUNTER-HERESY OPERATIONS: SUCCESSFUL', body: 'Recent tribunal action has neutralized a sectarian cell that was operating within the exchange bid network. Normal market operations have resumed. Commission thanks operators for their cooperation.', severity: 'advisory' },
  { headline: 'WALDENSIAN COMMERCIAL DISRUPTION REPORTED', body: 'Waldensian-affiliated traders identified operating under assumed identities on the exchange floor. Commission security is responding. Operators advised to confirm all counterparty credentials.', severity: 'elevated' },
];

// ---------------------------------------------------------------------------
// Private sale / dealer whisper templates
// ---------------------------------------------------------------------------

const PRIVATE_SALE_TEMPLATES: string[] = [
  'A Venetian intermediary is said to be quietly offering a Class I femur fragment at a significant discount to the last comparable transaction.',
  'Diplomatic sources indicate a treasury disposal is being arranged through back channels, bypassing the public exchange entirely.',
  'Dealer networks report that an undisclosed institutional collector has been accumulating Sebastian-class assets through private treaty sales.',
  'A consignment of relics from a dissolved Flemish monastery is reportedly available through a single intermediary at negotiated terms.',
  'Market whispers suggest a major collector is preparing to exit their entire Teresa-class position through private placement.',
  'Commission insiders indicate that a disputed lot, recently de-authenticated, may be re-offered through private channels at distressed pricing.',
  'A well-connected Roman dealer claims access to pre-market lots from an upcoming estate dispersal. Terms undisclosed.',
  'Quiet accumulation of Lucia-class relics by an unidentified buyer has drawn attention from institutional market-watchers.',
  'Sources close to the tribunal indicate that several quarantined lots may be released to a preferred buyer before re-entering the public exchange.',
  'An Iberian collector, reportedly motivated by completion pressure, has approached dealers seeking specific Bartholomew-class relics at premium pricing.',
  'Private treaty activity in Ambrose-class assets has increased notably, suggesting institutional interest that has not yet reached the public exchange.',
  'Dealer intelligence suggests a Francis-class relic of exceptional provenance will be offered privately before any exchange listing.',
];

// ---------------------------------------------------------------------------
// Default / quiet-market templates
// ---------------------------------------------------------------------------

const QUIET_MARKET_HEADLINES = [
  'Markets Open Steady as Operators Assess Positioning',
  'Exchange Activity Remains Within Normal Parameters',
  'Session Begins Under Stable Conditions Across All Classes',
  'Institutional Flows Balanced as Market Awaits Catalyst',
  'Relic Exchange Posts Uneventful Opening in Current Session',
  'Operators Hold Steady Amid Absence of Material Developments',
];

const QUIET_MARKET_BODIES = [
  'The relic exchange opened to stable conditions across all saint asset classes. Institutional collectors report normal levels of bid activity, with no immediate catalysts expected. Operators are advised to monitor the terminal feed for emerging developments that may alter the current equilibrium.',
  'Trading activity in the current session has proceeded within normal parameters, with no significant events to drive directional movement. Market depth remains healthy across all saint classes, and the Commission reports that authentication processing times are at standard levels. The prevailing calm may present an opportunity for operators seeking to establish or adjust positions without competing against event-driven capital flows.',
  'The exchange is operating under quiet conditions, with bid volumes tracking below the session average. Commission intelligence assets report no material developments on the horizon, though operators are reminded that conditions can shift rapidly. Current pricing levels reflect a market in equilibrium, offering neither obvious discounts nor premium-driven urgency.',
];

// ---------------------------------------------------------------------------
// Generation logic
// ---------------------------------------------------------------------------

function generateLeadArticle(
  market: MarketState,
  saints: Saint[],
): MediaArticle | null {
  const sortedEvents = [...market.activeEvents].sort((a, b) => b.startedAt - a.startedAt);
  const leadEvent = sortedEvents[0];

  if (leadEvent) {
    const templates = TEMPLATES[leadEvent.category] || TEMPLATES.heresy;
    const affectedNames = leadEvent.affectedSaints
      .map(id => saintNameById(id, saints))
      .slice(0, 3)
      .join(', ');

    return {
      type: 'lead',
      headline: pick(templates.headlines),
      subhead: pick(templates.subheads),
      body: pick(templates.bodies),
      dateline: `EXCHANGE FLOOR — ${affectedNames.toUpperCase()} CLASSES`,
      timestamp: leadEvent.startedAt,
      priority: 10,
    };
  }

  return {
    type: 'lead',
    headline: pick(QUIET_MARKET_HEADLINES),
    subhead: 'No significant events in current session',
    body: pick(QUIET_MARKET_BODIES),
    dateline: 'EXCHANGE FLOOR',
    timestamp: Date.now(),
    priority: 5,
  };
}

function generateSecondaryArticle(
  market: MarketState,
  saints: Saint[],
): MediaArticle | null {
  const sortedEvents = [...market.activeEvents].sort((a, b) => b.startedAt - a.startedAt);
  const secondEvent = sortedEvents[1];

  if (!secondEvent) {
    // Generate a collection-pressure or general-conditions story
    const nearComplete = saints.filter(s => s.collectedRelics.length / s.totalRelics > 0.6);
    if (nearComplete.length > 0) {
      const s = pick(nearComplete);
      const pct = Math.round((s.collectedRelics.length / s.totalRelics) * 100);
      return {
        type: 'secondary',
        headline: `Completion Pressure Mounts in ${s.name} Class as Collector Nears Threshold`,
        subhead: `Portfolio analysis indicates ${pct}% acquisition rate in targeted saint class`,
        body: `Market intelligence suggests that at least one institutional operator has reached an advanced stage of collection in the ${s.name} asset class, with acquisition levels that trigger the well-documented completion premium. Competitors in the same class face the prospect of escalating prices as the collector approaches the threshold at which enshrined valuations apply.`,
        dateline: `MARKET ANALYSIS — ${s.name.toUpperCase()} CLASS`,
        timestamp: Date.now(),
        priority: 7,
      };
    }
    return null;
  }

  const templates = TEMPLATES[secondEvent.category] || TEMPLATES.heresy;
  const affectedNames = secondEvent.affectedSaints
    .map(id => saintNameById(id, saints))
    .slice(0, 3)
    .join(', ');

  return {
    type: 'secondary',
    headline: pick(templates.headlines),
    subhead: pick(templates.subheads),
    body: pick(templates.bodies).slice(0, 280) + '...',
    dateline: `${secondEvent.category.toUpperCase()} DESK — ${affectedNames.toUpperCase()}`,
    timestamp: secondEvent.startedAt,
    priority: 8,
  };
}

function generateAuthDesk(market: MarketState): AuthDeskItem[] {
  const hasAuthEvent = market.activeEvents.some(e => e.category === 'authentication');
  const count = hasAuthEvent ? 3 : 2;
  return pickN(AUTH_DESK_TEMPLATES, count);
}

function generateHeresyWatch(market: MarketState): HeresyBulletin {
  const heresyEvents = market.activeEvents.filter(e => e.category === 'heresy');
  if (heresyEvents.length > 0) {
    const critical = HERESY_WATCH_TEMPLATES.filter(t => t.severity === 'critical');
    return pick(critical);
  }
  const hasAnyEvent = market.activeEvents.length > 0;
  if (hasAnyEvent) {
    const elevated = HERESY_WATCH_TEMPLATES.filter(t => t.severity === 'elevated' || t.severity === 'advisory');
    return pick(elevated);
  }
  const advisory = HERESY_WATCH_TEMPLATES.filter(t => t.severity === 'advisory');
  return pick(advisory);
}

function generatePrivateSales(): PrivateSaleItem[] {
  return pickN(PRIVATE_SALE_TEMPLATES, 2).map(text => ({ text }));
}

function generateMarketGlance(market: MarketState, saints: Saint[]): MarketGlanceRow[] {
  return saints.map(s => {
    const d = market.saintDemand[s.id] ?? 1.0;
    const delta = d - 1.0;
    const direction: MarketGlanceRow['direction'] = delta > 0.05 ? 'up' : delta < -0.05 ? 'down' : 'flat';
    return {
      saint: s.name,
      saintId: s.id,
      direction,
      delta,
      demandLevel: d,
    };
  });
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function generateFrontPage(
  market: MarketState,
  saints: Saint[],
  recentMessages: HerasyReport[],
): FrontPage {
  const lead = generateLeadArticle(market, saints);
  const secondary = generateSecondaryArticle(market, saints);
  const authDesk = generateAuthDesk(market);
  const heresyWatch = generateHeresyWatch(market);
  const privateSales = generatePrivateSales();
  const marketGlance = generateMarketGlance(market, saints);

  const terminalFeed = recentMessages.slice(-6).map(msg => ({
    text: msg.message,
    timestamp: msg.timestamp,
  }));

  return {
    lead,
    secondary,
    authDesk,
    heresyWatch,
    privateSales,
    marketGlance,
    terminalFeed,
    edition: editionLabel(),
    datestamp: formatDateline(),
  };
}

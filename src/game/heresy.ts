export interface HerasyReport {
  id: number;
  sect: Sect;
  message: string;
  timestamp: number;
}

export interface Sect {
  id: string;
  name: string;
  colorClass: string; // tailwind text class
  dotClass: string;   // tailwind bg class
}

export const SECTS: Sect[] = [
  { id: 'flagellant', name: 'FLAGELLANTS', colorClass: 'text-sect-red', dotClass: 'bg-sect-red' },
  { id: 'cathar', name: 'CATHARI', colorClass: 'text-sect-cyan', dotClass: 'bg-sect-cyan' },
  { id: 'gnostic', name: 'GNOSTIC ORDER', colorClass: 'text-sect-magenta', dotClass: 'bg-sect-magenta' },
  { id: 'bogomil', name: 'BOGOMILS', colorClass: 'text-sect-lime', dotClass: 'bg-sect-lime' },
  { id: 'waldensian', name: 'WALDENSIANS', colorClass: 'text-sect-orange', dotClass: 'bg-sect-orange' },
];

const HERESY_TEMPLATES = [
  (sect: string) => `[TRIBUNAL] ${sect} cell detected near reliquary cache`,
  (sect: string) => `[ALERT] ${sect} agents bidding under false provenance`,
  (sect: string) => `[INTERCEPT] ${sect} communiqué re: relic substitution`,
  (sect: string) => `[NOTICE] ${sect} delegation denied entry to exchange floor`,
  (sect: string) => `[WARNING] ${sect} counterfeit authentication seals in circulation`,
  (sect: string) => `[REPORT] ${sect} sympathizer identified among verified bidders`,
  (sect: string) => `[INQUIRY] ${sect} doctrine fragments found embedded in lot metadata`,
  (sect: string) => `[BREACH] ${sect} proxy bid network flagged by tribunal`,
  (sect: string) => `[SIGNAL] ${sect} sigil detected in provenance chain`,
  (sect: string) => `[PURGE] ${sect} affiliated lots quarantined pending review`,
  (sect: string) => `[TRACE] ${sect} encrypted bid patterns match known operatives`,
  (sect: string) => `[TRIBUNAL] ${sect} schismatic texts found in shipping manifest`,
  (sect: string) => `[SWEEP] ${sect} safe house yielded 3 unregistered relics`,
  (sect: string) => `[DECRYPT] ${sect} cipher broken — lot manipulation confirmed`,
  (sect: string) => `[EDICT] All ${sect} provenance claims suspended 48h`,
];

const SYSTEM_MESSAGES = [
  '> Market tick synchronized',
  '> Authentication layer verified',
  '> Relic provenance chain intact',
  '> Bid encryption nominal',
  '> Exchange rate: 1◈ = 1◈',
  '> Reliquary index updated',
  '> Lot queue replenished',
  '> Tribunal oversight: ACTIVE',
  '> Blessed connection maintained',
  '> Canonical verification: PASS',
  '> Provenance oracle responding',
  '> Sanctity hash: valid',
];

export function generateHeresyReport(counter: number): HerasyReport {
  const sect = SECTS[Math.floor(Math.random() * SECTS.length)];
  const template = HERESY_TEMPLATES[Math.floor(Math.random() * HERESY_TEMPLATES.length)];
  return {
    id: counter,
    sect,
    message: template(sect.name),
    timestamp: Date.now(),
  };
}

export function generateSystemMessage(counter: number): HerasyReport {
  const msg = SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)];
  return {
    id: counter,
    sect: { id: 'system', name: 'SYS', colorClass: 'text-muted-foreground', dotClass: 'bg-muted-foreground' },
    message: msg,
    timestamp: Date.now(),
  };
}
